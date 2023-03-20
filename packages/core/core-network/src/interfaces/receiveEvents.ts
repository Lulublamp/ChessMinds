import { ChessGame } from "../../../core-algo";
import { ClientEventManager } from "../ClientEventManager";
import { IN_GAME, MATCH_MAKING } from "../Namespace";
import { IGame } from "../utils/Queue";

export type ReactSetterOrNull<T> = React.Dispatch<
  React.SetStateAction<T | null>
>;
export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

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
  name: string;
}

export interface rINetworkMoveEvent {
  _forceUpdate: ReactSetter<number>;
  chessGame: ChessGame
}