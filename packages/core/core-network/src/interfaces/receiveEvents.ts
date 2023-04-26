import { ChessBoard, ChessGame, ChessPiece } from "../../../core-algo";
import { ClientEventManager } from "../ClientEventManager";
import { IN_GAME, MATCH_MAKING } from "../Namespace";
import { IGame } from "./game";

export interface Move {
  turn: number;
  white: string | null;
  whitePiece: ChessPiece | null;
  black: string | null;
  blackPiece: ChessPiece | null;
}

export type ReactSetterOrNull<T> = React.Dispatch<
  React.SetStateAction<T | null>
>;
export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type ReactRef<T> = React.MutableRefObject<T | null>;

export interface rICreateRoomEvent {
  setter: any;
  getter: any;
}

export interface rIIncomingGameEvent {
  gameSetter: ReactSetterOrNull<IGame>;
  triggerSetter: ReactSetter<boolean>;
  colorSetter: ReactSetter<boolean>;
  disconnect: ReactSetterOrNull<ClientEventManager<MATCH_MAKING>>;
  currentClientManager: ClientEventManager<MATCH_MAKING>;
  nextGameManager: ReactSetterOrNull<ClientEventManager<IN_GAME>>;
  gameRef: ReactRef<ClientEventManager<IN_GAME>>;
  name: string;
  url: string;
}

export interface rINetworkMoveEvent {
  _forceUpdate: ReactSetter<number>;
  chessGame: ChessGame
  movesData: Move[]
  boardHistory: ChessBoard[]
  setMovesData: ReactSetter<Move[]>
  setCurrentIndex : ReactSetter<number>
}

export interface rITimeEvent {
  timeSetter: ReactSetter<string>;
  time: string;
  id: "white" | "black";
}

export interface rITimeoutEvent {
  gameOver: ReactSetter<boolean>;
  onGameEnd: (gameResult : any) => void;
}