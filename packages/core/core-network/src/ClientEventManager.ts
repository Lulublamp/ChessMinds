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
} from "./interfaces/emitEvents";
import { CONNECTION, IN_GAME, MATCH_MAKING, NAMESPACE_TYPES, PRIVATE, PRIVATE_GAME } from "./Namespace";
import { Move, rICreateRoomEvent, rIIncomingGameEvent, rINetworkMoveEvent, rITimeEvent, rITimeoutEvent } from "./interfaces/receiveEvents";
import { IGame } from "./interfaces/game";
// import { PrivateLobby } from "./utils/Lobby";
import { ChessBoard, Color } from "../../core-algo";
import { PrivateLobby } from "./utils/Lobby";



export type IRespond =
  | eILeaveRoomEvent
  | eIMatchMakingStateEvent
type Check<T, R, K> = T extends R ? K : never;
type CheckArgs<T, R> = T extends never ? never : R

export class EventEmitter {
  readonly socket: Socket;

  constructor(urlServe: string, socketNameSpace: NAMESPACE_TYPES, token: string) {
    console.log(`connect to ${urlServe}/${socketNameSpace}`)
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
  private matchId: string | null = null

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
      payload.currentClientManager.close()
      payload.disconnect(() => null)
      //add animation
      const lstcase = document.querySelectorAll(".case");
      lstcase.forEach((e) => {
        e.classList.add("animation-start");
      });

      const gameManager = new ClientEventManager<IN_GAME>(payload.url, NAMESPACE_TYPES.IN_GAME, "")
      gameManager.attach(game.matchId, payload.name)
      payload.gameRef.current = gameManager;
      payload.nextGameManager(() => gameManager)
    });
  }

  public attach(matchId: Check<T, IN_GAME, string>, name: CheckArgs<typeof matchId, string>) {
    this.matchId = matchId
    this.send(EVENT_TYPES.ATTACH, { matchId, name })
  }

  public networkMove(data: Check<T, IN_GAME, { from: string, to: string }>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.MAKE_MOVE, { matchId: this.matchId, ...data });
  }

  public listenToNetworkMove(payload: Check<T, IN_GAME, rINetworkMoveEvent>, onGameEnd: (gameResult: any) => void) {
    if (this.matchId == null) return;
    console.log('listen to network move');

    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.MOVES, (from: string, to: string, gameResult: any) => {
      console.log('move received', from, to);

      payload.chessGame.setBoard(payload.boardHistory[payload.boardHistory.length - 1].copyBoard());
      const currentTurn = payload.chessGame.getCurrentTurn() == Color.White ? 'white' : 'black';
      console.log('current game', payload.chessGame);
      payload.chessGame.makeMove(from, to);
      payload.boardHistory.push(payload.chessGame.getBoard().copyBoard());
      console.log('board history', payload.boardHistory);
      payload.setCurrentIndex(payload.boardHistory.length - 1);

      // Gérer le résultat de la partie
      if (gameResult) {
        if (gameResult.status === 'checkmate') {
          // Gérer l'échec et mat
          console.log("CHECKMATE !");
          console.log(gameResult.message);
          onGameEnd(gameResult);
        } else if (gameResult.status === 'stalemate') {
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
        currentTurn == 'black' ? current.pop() : null;
        const moveAfter = [...current, thisMove!];
        payload.movesData = moveAfter;
        return moveAfter;
      });
    });
  }

  public firstMove(payload: Check<T, IN_GAME, eIFirstMoveEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    console.log('first move PAYLOAD', payload);
    this.send(EVENT_TYPES.FIRST_MOVE, payload);
  }

  public listenToTime(payload: Check<T, IN_GAME, rITimeEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.TIMER, (time) => {
      //console.log('time received' , time);
      const thisTime = payload.id == 'white' ? time.whiteTime : time.blackTime
      const timeInStringMinute = Math.floor(thisTime / 60).toString();
      console.log('time in string minute', timeInStringMinute);
      let timeInStringSecond = (thisTime % 60).toString();
      if (timeInStringSecond.length == 1) {
        timeInStringSecond = '0' + timeInStringSecond
      }
      //console.log('time in string second' , timeInStringSecond);
      //console.log(payload.time)
      payload.timeSetter(() => timeInStringMinute + ':' + timeInStringSecond)
    })
  }

  public listenToTimeout(payload: Check<T, IN_GAME, rITimeoutEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.TIME_OUT, (timeout) => {
      console.log('timeout received', timeout);
      payload.gameOver(() => true)
      payload.onGameEnd('')
    })
  }

  public close() {
    this.socket.close();
  }

  public sendFriendInvitations(payload: Check<T, CONNECTION, eIInviteFriend>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    console.log('invite sent', payload);  
    this.send(EVENT_TYPES.INVITE_FRIEND, payload);
  }

  public getInvitations(payload: Check<T, CONNECTION, null>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.send(EVENT_TYPES.GET_INVITATIONS, null);
  }

  public listenToInvitationsStatus(payload: Check<T, CONNECTION, null>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.INVITATIONS_STATUS, (invitations: number[]) => {
      console.log('All Invitations', invitations);
    });
  }

  public listenToIncomingInvitations(payload: Check<T, CONNECTION, null>) {
    if (!this.validateEmit(NAMESPACE_TYPES.CONNECTION)) return;
    this.socket.on(EVENT_TYPES.INVITATION_RECEIVED, (invitations) => {
      console.log('Invitations received', invitations);
    });
  }


  // public listenToFriendInvitations(callback: (invitations: number[]) => void) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_GAME)) return;
  //   this.socket.on(EVENT_TYPES.INVITE_AMI, (invitations: number[]) => {
  //     console.log('Invitations received', invitations);
  //     callback(invitations);
  //   });
  // }

  // public stopListeningToFriendInvitations() {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_GAME)) return;
  //   this.socket.off(EVENT_TYPES.INVITE_AMI);
  // }

}
