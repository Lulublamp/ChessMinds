import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";
import { Match, PPlayer } from "../utils/Queue";

export interface eIInitGameEvent {
  players: Match<PPlayer>;
}

export interface eILeaveRoomEvent {
  userId: string;
}

export type lobbyPlayer = Omit<Omit<PPlayer, "elo">, "socket">;

export type MMPlayer = Omit<PPlayer, "socket"> & {
  socketId?: string;
  options?: JoinQueuOption;
};

export interface eICreateLobbyEvent extends lobbyPlayer {}

export interface eICreateLobbyWithReturnEvent extends eICreateLobbyEvent {
  setter: (arg: any) => any;
}

export interface eIJoinLobbyEvent {
  player: lobbyPlayer;
  code: string;
}

export interface eIMatchMakingStateEvent {}

export interface eIJoinQueueEvent extends MMPlayer {
  options: JoinQueuOption;
}
