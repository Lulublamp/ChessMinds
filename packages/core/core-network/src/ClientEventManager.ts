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
import { Move, rICreateRoomEvent, rIIncomingGameEvent, rINetworkMoveEvent } from "./interfaces/receiveEvents";
import { IGame, Match, PPlayer } from "./utils/Queue";
import { PrivateLobby } from "./utils/Lobby";
import { ChessBoard, Color } from "../../core-algo";


export type IRespond =
  | eILeaveRoomEvent
  | eIMatchMakingStateEvent
  | eIInitGameEvent;
type Check<T, R, K> = T extends R ? K : never;
type CheckArgs<T , R> = T extends never ? never : R

export class EventEmitter {
  readonly socket: Socket;

  constructor(socketNameSpace: NAMESPACE_TYPES , token: string) {
    console.log("Connecting socket : ", token);
    this.socket = io(`http://localhost:3001/${socketNameSpace}`, {
      transports: ["websocket"],
      auth: {
        access_token: `Bearer ${token}`,
      },
      reconnectionAttempts: 3,
    });
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
  private matchId: string | null = null

  constructor(type: T, token: string) {
    super(type , token);
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

      const gameManager = new ClientEventManager<IN_GAME>(NAMESPACE_TYPES.IN_GAME , "")
      gameManager.attach(game.matchId , payload.name)
      payload.nextGameManager(() => gameManager)
    });
  }

  public attach(matchId: Check<T , IN_GAME , string> , name: CheckArgs<typeof matchId , string>){
    this.matchId = matchId
    this.send(EVENT_TYPES.ATTACH , {matchId , name})
  }

  public networkMove(data: Check<T , IN_GAME , {from: string, to: string}>) {
    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.send(EVENT_TYPES.MAKE_MOVE , {matchId: this.matchId , ...data});
  }
  
  public listenToNetworkMove(payload: Check<T , IN_GAME , rINetworkMoveEvent>){
    if (this.matchId == null) return
    console.log('listen to network move')

    if (!this.validateEmit(NAMESPACE_TYPES.IN_GAME)) return;
    this.socket.on(EVENT_TYPES.MOVES , (from: string , to:string) => {
      console.log('move received' , from , to);
      
      payload.chessGame.setBoard(payload.boardHistory[payload.boardHistory.length - 1].copyBoard());
      const currentTurn = payload.chessGame.getCurrentTurn() == Color.White ? 'white' : 'black';
      console.log('current game' , payload.chessGame);
      payload.chessGame.makeMove(from , to);
      payload.boardHistory.push(payload.chessGame.getBoard().copyBoard());
      console.log('board history' , payload.boardHistory);
      payload.setCurrentIndex(payload.boardHistory.length - 1);

      let thisMove: Move | null = null;
      if (payload.movesData.length == 0){
        thisMove = {
          turn: 1,
          white: to,
          whitePiece: payload.chessGame.getBoard().getPieceAt(to),
          black: null,
          blackPiece: null
        }
      } else {
        const lastMove = payload.movesData[payload.movesData.length - 1]
        if (lastMove.black == null){
          thisMove = {
            turn: lastMove.turn,
            white: lastMove.white,
            whitePiece: lastMove.whitePiece,
            black: to,
            blackPiece: payload.chessGame.getBoard().getPieceAt(to)
          }
        }else{
          thisMove = {
            turn: lastMove.turn + 1,
            white: to,
            whitePiece: payload.chessGame.getBoard().getPieceAt(to),
            black: null,
            blackPiece: null
          }
        }
      }
        
      payload.setMovesData((current) => {
        currentTurn == 'black' ? current.pop() : null
        const moveAfter = [...current , thisMove!]
        payload.movesData = moveAfter 
        return moveAfter
      })

    });
  }

  public close() {
    this.socket.close();
  }
}
