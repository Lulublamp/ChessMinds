import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";
import { ChatMessage } from "../utils/Chat";



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
  matchId: string,
  options: JoinQueuOption,
}
export interface eIRequestChatHistoryEvent {
  matchId: string;
}

export interface eISendChatMessageEvent extends Omit<ChatMessage, 'timestamp'> {}

export interface eIReceiveChatMessageEvent extends ChatMessage {}
