/* eslint-disable turbo/no-undeclared-env-vars */
import { EVENT_TYPES } from "./Event";
import { Socket, io } from "socket.io-client";
import {
  eIJoinQueueEvent,
  eILeaveRoomEvent,
  eIMatchMakingStateEvent,
  eIFirstMoveEvent,
  eISendEnviteEvent,
  eIInviteFriend,
  eIPGInvitation,
  eIPGProcess,
  eISendChatMessageEvent,
  eIDrawRequestEvent,
  eIDrawResponseEvent,
  eILeaveLobbyEvent,
  eISwitchReady,
  eIStartPG,
  eIAbandonGameEvent,
} from "./interfaces/emitEvents";
import {
  CONNECTION,
  IN_GAME,
  MATCH_MAKING,
  NAMESPACE_TYPES,
  PRIVATE,
  PRIVATE_GAME,
} from "./Namespace";
import {
  Move,
  PGinvitations,
  rICreateRoomEvent,
  rIIncomingGameEvent,
  rIInvitationFriendEvent,
  rIJoinLobbyEvent,
  rINetworkMoveEvent,
  rIPGInvitation,
  rITimeEvent,
  rITimeoutEvent,
  rIReceiveChatMessageEvent,
  rIRequestChatHistoryEvent,
  rILeaveLobbyEvent,
  rILobbyLeaveEvent,
  rIReadySwitched,
  rILobbyCreated,
  rIPGStartEvent,
  rILinkingEvent,
  rIAbandonGameEvent,
  rIReceiveDrawRequestEvent,
  rIReceiveDrawResponseEvent,
  rINoTimeEvent,
} from "./interfaces/receiveEvents";

import { IGame } from "./interfaces/game";
// import { PrivateLobby } from "./utils/Lobby";
import { ChessBoard, Color } from "../../core-algo";
import { PrivateLobby } from "./utils/Lobby";
import { ChatMessage } from "./utils/Chat";

export type IRespond = eILeaveRoomEvent | eIMatchMakingStateEvent;
type Check<T, R, K> = T extends R ? K : never;
type CheckArgs<T, R> = T extends never ? never : R;

export class EventEmitter {
  readonly socket: Socket;

  constructor(
    urlServe: string,
    socketNameSpace: NAMESPACE_TYPES,
    token: string
  ) {
    console.log(`connect to ${urlServe}/${socketNameSpace}`);
    this.socket = io(`${urlServe}/${socketNameSpace}`, {
      transports: ["websocket"],
      auth: {
        access_token: `Bearer ${token}`,
      },
      reconnectionAttempts: 3,
    });
  }

  private _send(event: EVENT_TYPES, data: IRespond | null) {
    this.socket.emit(event, data, (response: any) => {
      console.log("response ack", response);
      return response;
    });
  }

  protected send(event: EVENT_TYPES, data: IRespond | null) {
    console.log("typeof data", typeof data);
    this._send(event, data);
  }

  protected sendWithCallback(
    event: EVENT_TYPES,
    data: IRespond,
    callback: (arg: any) => any
  ) {
    this.socket.emit(event, data, (response: any) => {
      callback(response);
    });
  }
}

export class ClientEventManager<
  T extends NAMESPACE_TYPES
> extends EventEmitter {
  private type: T;
  private matchId: string | null = null;

  constructor(urlServe: string, type: T, token: string) {
    super(urlServe, type, token);
    this.type = type;
  }

  private validateEmit(arg: any): boolean {
    if (!(this.type == arg)) {
      return false;
    }
    return true;
  }

  public joinMatchMakingEvent(data: Check<T, MATCH_MAKING, eIJoinQueueEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.MATCH_MAKING)) return;
    this.send(EVENT_TYPES.JOIN_QUEUE, data);
  }

  public listenToIncomingMatch(
    payload: Check<T, MATCH_MAKING, rIIncomingGameEvent>
  ) {
    if (!this.validateEmit(NAMESPACE_TYPES.MATCH_MAKING)) return;
    this.socket.on(EVENT_TYPES.INCOMING_CATCH, (game: IGame) => {
      console.log("there is a match !");
      payload.gameSetter(() => game);

      payload.colorSetter(() =>
        game.white_player.name == payload.name ? true : false
      );
      payload.triggerSetter(() => true);
      payload.currentClientManager.close();
      payload.disconnect(() => null);
      //add animation
      const lstcase = document.querySelectorAll(".case");
      lstcase.forEach((e) => {
        e.classList.add("animation-start");
      });

      const gameManager = new ClientEventManager<IN_GAME>(
        payload.url,
        NAMESPACE_TYPES.IN_GAME,
        ""
      );
      gameManager.attach(game.matchId, payload.name);
      payload.gameRef.current = gameManager;
      payload.nextGameManager(() => gameManager);
    });
  }

  public offListenToIncomingMatch() {
    if (!this.validateEmit(NAMESPACE_TYPES.MATCH_MAKING)) return;
    this.socket.off(EVENT_TYPES.INCOMING_CATCH);
  }

  public attach(
    matchId: Check<T, IN_GAME, string>,
    name: CheckArgs<typeof matchId, string>
  ) {
    this.matchId = matchId;
    this.send(EVENT_TYPES.ATTACH, { matchId, name });
  }

  public networkMove(
    data: Check<T, IN_GAME, { from: string; to: string; promotion?: string }>
  ) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.MAKE_MOVE, { matchId: this.matchId, ...data });
  }

  public listenToNetworkMove(
    payload: Check<T, IN_GAME, rINetworkMoveEvent>,
    onGameEnd: (gameResult: any) => void
  ) {
    if (this.matchId == null) return;
    console.log("listen to network move");
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(
      EVENT_TYPES.MOVES,
      (from: string, to: string, promotion: string, gameResult: any) => {
        console.log("move received", from, to);
        const currentTurn =
          payload.chessGame.getCurrentTurn() == Color.White ? "white" : "black";
        payload.chessGame.makeMove(from, to, promotion);
        payload.boardHistory.push(payload.chessGame.getBoard().copyBoard());
        payload.setCurrentIndex(payload.boardHistory.length - 1);
        // Gérer le résultat de la partie
        if (gameResult) {
          if (gameResult.status === "checkmate") {
            // Gérer l'échec et mat
            console.log("CHECKMATE !");
            console.log(gameResult.message);
            onGameEnd(gameResult);
          } else if (gameResult.status === "stalemate") {
            // Gérer le pat
            console.log("STALEMATE !");
            console.log(gameResult.message);
            onGameEnd(gameResult);
          }
          return; // Ne pas continuer avec la mise à jour des mouvements si la partie est terminée
        }

        let thisMove: Move | null = null;
        if (payload.movesData.length == 0) {
          thisMove = {
            turn: 1,
            white: to,
            whitePiece: payload.chessGame.getBoard().getPieceAt(to),
            black: null,
            blackPiece: null,
          };
        } else {
          const lastMove = payload.movesData[payload.movesData.length - 1];
          if (lastMove.black == null) {
            thisMove = {
              turn: lastMove.turn,
              white: lastMove.white,
              whitePiece: lastMove.whitePiece,
              black: to,
              blackPiece: payload.chessGame.getBoard().getPieceAt(to),
            };
          } else {
            thisMove = {
              turn: lastMove.turn + 1,
              white: to,
              whitePiece: payload.chessGame.getBoard().getPieceAt(to),
              black: null,
              blackPiece: null,
            };
          }
        }

        payload.setMovesData((current) => {
          currentTurn == "black" ? current.pop() : null;
          const moveAfter = [...current, thisMove!];
          payload.movesData = moveAfter;
          return moveAfter;
        });
      }
    );
  }

  public listNoTime(payload: Check<T, IN_GAME, rINoTimeEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.NO_TIME, (gameResult: any) => {
      console.log("no time received", gameResult);
      payload.onGameEnd(gameResult);
    });
  }

  public offListenToNetworkMove() {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.off(EVENT_TYPES.MOVES);
  }

  public firstMove(payload: Check<T, IN_GAME, eIFirstMoveEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    console.log("first move PAYLOAD", payload);
    this.send(EVENT_TYPES.FIRST_MOVE, payload);
  }

  public listenToTime(payload: Check<T, IN_GAME, rITimeEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.TIMER, (time) => {
      //console.log('time received' , time);
      const thisTime = payload.id == "white" ? time.whiteTime : time.blackTime;
      const timeInStringMinute = Math.floor(thisTime / 60).toString();
      //console.log('time in string minute', timeInStringMinute);
      let timeInStringSecond = (thisTime % 60).toString();
      if (timeInStringSecond.length == 1) {
        timeInStringSecond = "0" + timeInStringSecond;
      }
      //console.log('time in string second' , timeInStringSecond);
      //console.log(payload.time)
      payload.timeSetter(() => timeInStringMinute + ":" + timeInStringSecond);
    });
  }

  public offListenToTime() {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.off(EVENT_TYPES.TIMER);
  }

  public listenToTimeout(payload: Check<T, IN_GAME, rITimeoutEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.TIME_OUT, (timeout) => {
      console.log("timeout received", timeout);
      payload.gameOver(() => true);
      payload.onGameEnd("");
    });
  }

  public offListenToTimeout() {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.off(EVENT_TYPES.TIME_OUT);
  }

  public close() {
    this.socket.close();
  }

  public sendFriendInvitations(payload: Check<T, CONNECTION, eIInviteFriend>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    console.log("Invite sent", payload);
    this.send(EVENT_TYPES.INVITE_FRIEND, payload);
  }

  public processInvitation(payload: Check<T, CONNECTION, eIInviteFriend>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    console.log("Process invitation", payload);
    this.send(EVENT_TYPES.PROCESS_INVITATION, payload);
  }

  public getInvitations(payload: Check<T, CONNECTION, null>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.GET_INVITATIONS, null);
  }

  public listenToInvitationsStatus(
    payload: Check<T, CONNECTION, rIInvitationFriendEvent>
  ) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.INVITATIONS_STATUS, (invitations: number[]) => {
      console.log("All Invitations", invitations);
      payload.SetteurLstIdInvite(() => invitations);
    });
  }

  public listenToIncomingInvitations(
    payload: Check<T, CONNECTION, rIInvitationFriendEvent>
  ) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.INVITATION_RECEIVED, (invitations) => {
      console.log("Invitations received", invitations);
      payload.SetteurLstIdInvite(() => [
        ...payload.lstIdInvite,
        invitations.idInviter,
      ]);
    });
  }

  public createLobby(payload: Check<T, CONNECTION, null>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.CREATE_LOBBY, null);
  }

  public leaveLobby(payload: Check<T, CONNECTION, eILeaveLobbyEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.LEAVE_LOBBY, payload);
  }

  public listenToLobbyLeave(payload: Check<T, CONNECTION, rILobbyLeaveEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.LOBBY_LEAVE, (lobby) => {
      console.log("Lobby leaved, current : ", lobby);
      if (lobby.isHost) {
        payload?.callback();
      } else {
        console.log(payload);
        const copLobbie = payload?.lobby;
        copLobbie?.pop();
        payload?.setLobby(() => copLobbie!);
      }
      // payload.Settlobby(() => lobby);
    });
  }

  public offListenToLobbyLeave() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.LOBBY_LEAVE);
  }

  public listenToJoinLobby(payload: Check<T, CONNECTION, rIJoinLobbyEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.LOBBY_STATUS, (lobby) => {
      console.log("Lobby received", lobby);
      payload.Settlobby(lobby);
      payload.lobbyRef.current = lobby;
      if (payload.isHost) {
        payload.setReadyArray((prev) => {
          const isHostReady = prev[0];
          if (isHostReady) {
            payload.onReadyChange("reset");
            payload.setChecked(false);
          }
          return [false, false];
        });
      } else {
        payload.setReadyArray([false, false]);
      }
      if (!payload.isHost) {
        payload.goToPrivateGame();
      }
    });
  }

  public offListenToJoinLobby() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.LOBBY_STATUS);
  }

  public sendPGinvitation(payload: Check<T, CONNECTION, eIPGInvitation>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.PG_INVITATION, payload);
  }

  public listenToPGinvitation(payload: Check<T, CONNECTION, rIPGInvitation>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(
      EVENT_TYPES.RECEIVE_PG_INVITATION,
      (invitations: PGinvitations) => {
        console.log("PG Invitations received", invitations);
        payload.setPopup(true);
        payload.setPGInvitations((current) => [...current, invitations]);
      }
    );
  }

  public offListenToPGinvitation() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.RECEIVE_PG_INVITATION);
  }

  public processPGInvitation(payload: Check<T, CONNECTION, eIPGProcess>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.PROCESS_PG_INVITATION, payload);
  }

  public sendChatMessage(payload: Check<T, IN_GAME, eISendChatMessageEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.SEND_CHAT_MESSAGE, payload);
  }

  public listenToChatMessage(
    payload: Check<T, IN_GAME, rIReceiveChatMessageEvent>
  ) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.RECEIVE_CHAT_MESSAGE, (message: ChatMessage) => {
      payload.setChat((current) => [...current, message]);
    });
  }

  public getChatHistory(payload: Check<T, IN_GAME, rIRequestChatHistoryEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.REQUEST_CHAT_HISTORY, payload);
  }

  public sendDrawRequest(payload: Check<T, IN_GAME, eIDrawRequestEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.DRAW_REQUEST, payload);
  }

  public listenToDrawRequest(payload: Check<T, IN_GAME, rIReceiveDrawRequestEvent>) {
    if(!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.DRAW_REQUEST, () => {
      payload.setDrawRequest(() => true);
    });
  }

  public sendDrawResponse(payload: Check<T, IN_GAME, eIDrawResponseEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.DRAW_RESPONSE, payload);
  }

  public listenToDrawResponse(payload: Check<T, IN_GAME, rIReceiveDrawResponseEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.DRAW_RESPONSE, (response: any) => {
      payload.onResponse(response.accepted, response.neweloBlanc, response.neweloNoir);
    });
  }


  public sendSwitchReady(payload: Check<T, CONNECTION, eISwitchReady>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.SWITCH_READY, payload);
  }

  public listenToReadySwitched(payload: Check<T, CONNECTION, rIReadySwitched>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.READY_SWITCHED, (payload_r: any) => {
      payload.setReadyArray((prev) => {
        const target: number = payload_r.target;
        const current = prev[target];
        const result: [boolean, boolean] = [
          target == 0 ? !current : prev[0],
          target == 1 ? !current : prev[1],
        ];
        return result;
      });
    });
  }

  public offListenToReadySwitched() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.READY_SWITCHED);
  }

  public listenToLobbyCreated(payload: Check<T, CONNECTION, rILobbyCreated>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.LOBBY_CREATED, (lobby) => {
      console.log("Lobby created in core network", lobby);
      payload.setLobbyId(lobby);
    });
  }

  public offListenToLobbyCreated() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.LOBBY_CREATED);
  }

  public sendStartPG(payload: Check<T, CONNECTION, eIStartPG>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.START_PG, payload);
  }

  public listenToPGStarting(payload: Check<T, CONNECTION, rIPGStartEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.PG_STARTED, ({ lobbyId }) => {
      const { navigateToGame } = payload;
      console.log("PG started", lobbyId);
      navigateToGame(lobbyId);
    });
  }

  public offListenToPGStarting() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.PG_STARTED);
  }

  public listenToLinking(payload: Check<T, CONNECTION, rILinkingEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.LINKING, () => {
      //
      console.log("Linking");
    });
  }

  public offListenToLinking() {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.off(EVENT_TYPES.LINKING);
  }

  public sendAbandonGame(payload: Check<T, IN_GAME, eIAbandonGameEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.ABANDON_GAME, payload);
  }

  public listenToAbandonGame(payload: Check<T, IN_GAME, rIAbandonGameEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.ABANDON_GAME, (response: any) => {
      payload.onGameAbandon(response.winner, response.newEloBlanc, response.newEloNoir);
    });
  }

}
