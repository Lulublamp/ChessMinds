import { Match, Player } from "../Queue";

export interface eICreateRoomEvent{
  roomId: string;
  roomName: string;
  roomElo: number;
}

export interface eIInitGameEvent extends eICreateRoomEvent{
  players: Match;
}

export interface eILeaveRoomEvent {

}

export interface eIMatchMakingStateEvent {
  
}
