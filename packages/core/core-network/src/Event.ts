  export const EVENT_TYPES = {
  JOIN_QUEUE: 'JOIN_QUEUE',
  LEAVE_QUEUE: 'LEAVE_QUEUE',
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
  MATCH_MAKING_STATE_R: 'MATCH_MAKING_STATE',
  MAKE_MOVE: 'MAKE_MOVE',
  MATCH_STATE: 'MATCH_STATE',
  MATCH_END: 'MATCH_END',
  MAKE_MOVE_ACK: 'MAKE_MOVE_ACK',
  MOVES: 'MOVES',
  ATTACH: 'ATTACH',
  FIRST_MOVE: 'FIRST_MOVE',
} as const;



export type EVENT_TYPES = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type JOIN_QUEUE_R = typeof EVENT_TYPES.JOIN_QUEUE
export type LEAVE_QUEUE_R = typeof EVENT_TYPES.LEAVE_QUEUE
export type MATCH_MAKING_STATE = typeof EVENT_TYPES.MATCH_MAKING_STATE_R
export type INIT_GAME = typeof EVENT_TYPES.INIT_GAME
export type INCOMING_CATCH = typeof EVENT_TYPES.INCOMING_CATCH
export type CREATE_LOBBY = typeof EVENT_TYPES.CREATE_LOBBY
export type JOIN_LOBBY = typeof EVENT_TYPES.JOIN_LOBBY
export type LEAVE_LOBBY = typeof EVENT_TYPES.LEAVE_LOBBY
export type DELETE_LOBBY = typeof EVENT_TYPES.DELETE_LOBBY
export type LOBBY_PLAYER_READY = typeof EVENT_TYPES.LOBBY_PLAYER_READY
export type LOBBY_PLAYER_UNREADY = typeof EVENT_TYPES.LOBBY_PLAYER_UNREADY
export type LOBBY_PLAYERS_UPDATE = typeof EVENT_TYPES.LOBBY_PLAYERS_UPDATE
export type LOBBY_START_GAME = typeof EVENT_TYPES.LOBBY_START_GAME
export type MAKE_MOVE = typeof EVENT_TYPES.MAKE_MOVE
export type MATCH_STATE = typeof EVENT_TYPES.MATCH_STATE
export type MATCH_END = typeof EVENT_TYPES.MATCH_END
export type MAKE_MOVE_ACK = typeof EVENT_TYPES.MAKE_MOVE_ACK
export type MOVES = typeof EVENT_TYPES.MOVES
export type ATTACH = typeof EVENT_TYPES.ATTACH
export type FIRST_MOVE = typeof EVENT_TYPES.FIRST_MOVE