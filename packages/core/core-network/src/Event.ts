  export const EVENT_TYPES = {
  JOIN_QUEUE_R: 'JOIN_QUEUE',
  LEAVE_QUEUE_R: 'LEAVE_QUEUE',
  MATCH_MAKING_STATE_R: 'MATCH_MAKING_STATE',
  INIT_GAME: 'INIT_GAME',
  INCOMING_CATCH: 'INCOMING_CATCH',
  CREATE_LOBBY: 'CREATE_LOBBY',
  JOIN_LOBBY: 'JOIN_LOBBY',
  LEAVE_LOBBY: 'LEAVE_LOBBY',
  DELETE_LOBBY: 'DELETE_LOBBY',
  LOBBY_PLAYER_READY: 'LOBBY_PLAYER_READY',
  LOBBY_PLAYER_UNREADY: 'LOBBY_PLAYER_UNREADY',
  LOBBY_PLAYERS_UPDATE: 'LOBBY_PLAYERS_UPDATE',
  LOBBY_START_GAME: 'LOBBY_START_GAME',
} as const;



export type EVENT_TYPES = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type JOIN_QUEUE_R = typeof EVENT_TYPES.JOIN_QUEUE_R
export type LEAVE_QUEUE_R = typeof EVENT_TYPES.LEAVE_QUEUE_R
export type MATCH_MAKING_STATE = typeof EVENT_TYPES.MATCH_MAKING_STATE_R
export type INIT_GAME = typeof EVENT_TYPES.INIT_GAME
export type INCOMING_CATCH = typeof EVENT_TYPES.INCOMING_CATCH
export type CREATE_LOBBY = typeof EVENT_TYPES.CREATE_LOBBY
export type JOIN_LOBBY = typeof EVENT_TYPES.JOIN_LOBBY
export type LEAVE_LOBBY = typeof EVENT_TYPES.LEAVE_LOBBY
export type DELETE_LOBBY = typeof EVENT_TYPES.DELETE_LOBBY