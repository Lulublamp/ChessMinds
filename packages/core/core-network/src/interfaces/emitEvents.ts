import { Match, PPlayer } from "../utils/Queue";

export interface eICreateRoomEvent{
  roomId: string;
  roomName: string;
  roomElo: number;
}

export interface eIInitGameEvent extends eICreateRoomEvent{
  players: Match;
}

export interface eILeaveRoomEvent {
  userId: string;
}

export interface eIJoinLobbyEvent {
  player: PPlayer;
  code: string;
}

export interface eIMatchMakingStateEvent {
  
}

export interface eIJoinQueueEvent extends Omit<PPlayer , 'socket'>{}
  