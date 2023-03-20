import { EVENT_TYPES } from "./Event";
import { Socket, io } from "socket.io-client";
import {
  eIInitGameEvent,
  eIJoinQueueEvent,
  eILeaveRoomEvent,
  eIMatchMakingStateEvent,
  eIJoinLobbyEvent,
  eICreateLobbyEvent,
  eICreateLobbyWithReturnEvent,
  lobbyPlayer,
} from "./interfaces/emitEvents";
import { IN_GAME, MATCH_MAKING, NAMESPACE_TYPES } from "./Namespace";
import { rICreateRoomEvent, rIIncomingGameEvent } from "./interfaces/receiveEvents";
import { IGame, Match, PPlayer } from "./utils/Queue";
import { PrivateLobby } from "./utils/Lobby";

export type IRespond =
  | eILeaveRoomEvent
  | eIMatchMakingStateEvent
  | eIInitGameEvent;
type Check<T, R, K> = T extends R ? K : never;

export class EventEmitter {
  readonly socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  private _send(event: EVENT_TYPES, data: IRespond) {
    this.socket.emit(event, data, (response: any) => {
      console.log("response ack", response);
      return response;
    });
  }

  protected send(event: EVENT_TYPES, data: IRespond) {
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

  constructor(type: T, token: string) {
    console.log("Connecting socket : ", token);
    const socket = io(`http://localhost:3001/${type}`, {
      transports: ["websocket"],
      auth: {
        access_token: `Bearer ${token}`,
      },
      reconnectionAttempts: 3,
    });
    super(socket);
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
      const gameManager = new ClientEventManager<IN_GAME>(NAMESPACE_TYPES.IN_GAME , "")
      payload.nextGameManager(() => gameManager)
    });
  }

  // public joinMatchMakingEvent(data: Check<T , MM_RANKED , eIJoinQueueEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return
  //   this.send(EVENT_TYPES.JOIN_QUEUE_R, data);
  // }

  // public leaveMatchMakingEvent(data: Check<T , MM_RANKED , eILeaveRoomEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return
  //   this.send(EVENT_TYPES.LEAVE_QUEUE_R, data);
  // }

  // public listenToInitGameOnce(data: Check<T , MM_RANKED , {setter: (arg: any) => any}>) {
  //   console.log('init listner')
  //   if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return
  //   this.socket.on(EVENT_TYPES.INIT_GAME, (dat: Match<PPlayer>) => {
  //     console.log('Match object -->' , dat)
  //     console.log('there is a match !')
  //     data.setter(() => dat);
  //   })
  //   console.log('init listner -->end')
  // }

  // //Lobbby events
  // public createLobbyEvent(data: Check<T , PRIVATE_LOBBY , eICreateLobbyWithReturnEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.sendWithCallback(EVENT_TYPES.CREATE_LOBBY, data , (response: any) => {
  //     data.setter(response);
  //   });
  // }

  // public joinLobbyEvent(data: Check<T , PRIVATE_LOBBY , eIJoinLobbyEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.send(EVENT_TYPES.JOIN_LOBBY, data);
  // }

  // public leaveLobbyEvent(data: Check<T , PRIVATE_LOBBY , eIJoinLobbyEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.send(EVENT_TYPES.LEAVE_LOBBY, data);
  // }

  // public playerReadyEvent(data: Check<T , PRIVATE_LOBBY , eIJoinLobbyEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.send(EVENT_TYPES.LOBBY_PLAYER_READY, data);
  // }

  // public playerUnreadyEvent(data: Check<T , PRIVATE_LOBBY , eIJoinLobbyEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.send(EVENT_TYPES.LOBBY_PLAYER_UNREADY, data);
  // }

  // public startGameEvent(data: Check<T , PRIVATE_LOBBY , eIJoinLobbyEvent>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.send(EVENT_TYPES.LOBBY_START_GAME, data);
  // }

  // public listenToUpdatePlayers(data: Check<T , PRIVATE_LOBBY , {setter: (arg: any) => any}>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.socket.on(EVENT_TYPES.LOBBY_PLAYERS_UPDATE, (dat: Match<lobbyPlayer>) => {
  //     data.setter(() => dat);
  //   })
  // }

  // public listenToStartGame(data: Check<T , PRIVATE_LOBBY , {setter: (arg: any) => any}>) {
  //   if (!this.validateEmit(NAMESPACE_TYPES.PRIVATE_LOBBY)) return
  //   this.socket.on(EVENT_TYPES.LOBBY_START_GAME, (dat: Match<lobbyPlayer>) => {
  //     data.setter(() => dat);
  //   })
  // }

  public close() {
    this.socket.close();
  }
}
