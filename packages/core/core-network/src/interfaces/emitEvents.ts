import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";
import { ChatMessage } from "../utils/Chat";
import { IGame } from "./game";



export interface eILeaveRoomEvent {
  userId: string;
}

// export type lobbyPlayer = Omit<Omit<PPlayer, "elo">, "socket">;

// export type MMPlayer = Omit<PPlayer, "socket"> & {
//   socketId?: string;
//   options?: JoinQueuOption;
// };

// export interface eICreateLobbyEvent extends lobbyPlayer {}

// export interface eICreateLobbyWithReturnEvent extends eICreateLobbyEvent {
//   setter: (arg: any) => any;
// }

// export interface eIJoinLobbyEvent {
//   player: lobbyPlayer;
//   code: string;
// }

export interface eIMatchMakingStateEvent {}

export interface eIJoinQueueEvent {
  options: JoinQueuOption;
}

export interface eIMakeMoveEvent {
  matchId: string,
  from: string,
  to: string,
}

export interface eIFirstMoveEvent {
  game: IGame
}
export interface eIRequestChatHistoryEvent {
  matchId: string;
}

export interface eISendChatMessageEvent extends Omit<ChatMessage, 'timestamp'> {}

export interface eIReceiveChatMessageEvent extends ChatMessage {}

export interface eIInviteAmisEvent {
  idJoueur: number;
}

export interface eIInvitationResponseEvent {
  joueur: any;
  response: boolean;
}

export interface eIChangeTimerEvent {
  lobbyId: string;
  timer: MATCHMAKING_MODES_TIMERS;
}

export interface eILobbyPlayerReadyEvent {
  lobbyId: string;
}

export interface eISendEnviteEvent {
  idJoueur: number;
  idJoueurInvite: number;
}


export interface eIInviteFriend {
  idInvite: number;
}
