import { Match, PPlayer } from "../utils/Queue";



export interface eIInitGameEvent{
  players: Match<PPlayer>;
}

export interface eILeaveRoomEvent {
  userId: string;
}

export type lobbyPlayer = Omit<Omit<PPlayer, 'elo'> , 'socket'> 

export interface eICreateLobbyEvent extends lobbyPlayer {
}

export interface eICreateLobbyWithReturnEvent extends eICreateLobbyEvent {
  setter: (arg: any) => any;
}

export interface eIJoinLobbyEvent {
  player: lobbyPlayer;
  code: string;
}


export interface eIMatchMakingStateEvent {
  
}

export interface eIJoinQueueEvent extends Omit<PPlayer , 'socket'>{}
  