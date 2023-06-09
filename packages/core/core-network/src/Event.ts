export const EVENT_TYPES = {
  JOIN_QUEUE: 'JOIN_QUEUE',
  LEAVE_QUEUE: 'LEAVE_QUEUE',
  INIT_GAME: 'INIT_GAME',
  INCOMING_CATCH: 'INCOMING_CATCH',
  MATCH_MAKING_STATE_R: 'MATCH_MAKING_STATE',
  MAKE_MOVE: 'MAKE_MOVE',
  MATCH_STATE: 'MATCH_STATE',
  MATCH_END: 'MATCH_END',
  MAKE_MOVE_ACK: 'MAKE_MOVE_ACK',
  MOVES: 'MOVES',
  ATTACH: 'ATTACH',
  FIRST_MOVE: 'FIRST_MOVE',
  TIMER: 'TIMER',
  NO_TIME: 'NO_TIME',
  REQUEST_CHAT_HISTORY: "REQUEST_CHAT_HISTORY",
  SEND_CHAT_HISTORY: "SEND_CHAT_HISTORY",
  SEND_CHAT_MESSAGE: "SEND_CHAT_MESSAGE",
  RECEIVE_CHAT_MESSAGE: "RECEIVE_CHAT_MESSAGE",
  GAME_END: "GAME_END",
  TIME_OUT: "TIME_OUT",
  CANCEL_MOVE: "CANCEL_MOVE",
  CANCEL_MOVE_REQUEST: "CANCEL_MOVE_REQUEST",
  CANCEL_MOVE_RESPONSE: "CANCEL_MOVE_RESPONSE",
  DRAW_REQUEST: "DRAW_REQUEST",
  DRAW_RESPONSE: "DRAW_RESPONSE",
  ABANDON_GAME: "ABANDON_GAME",
  GET_AMIS_WITH_STATUS: "GET_AMIS_WITH_STATUS",
  AMIS_ONLINE: "AMIS_ONLINE",
  AMIS_OFFLINE: "AMIS_OFFLINE",
  LOBBY_INVITE_AMI: "LOBBY_INVITE_AMI",
  LOBBY_INVITATION_RESPONSE: "LOBBY_INVITATION_RESPONSE",
  UPDATE_LOBBY: "UPDATE_LOBBY",
  CHANGE_TIMER: "CHANGE_TIMER",
  LOBBY_PLAYER_READY: "LOBBY_PLAYER_READY",
  LOBBY_PLAYER_UNREADY: "LOBBY_PLAYER_UNREADY",
  LOBBY_START_GAME: "LOBBY_START_GAME",
  INVITE_AMI: "INVITE_AMI",
  INVITATION_RESPONSE: "INVITATION_RESPONSE",
  // INVITATION_RECEIVED: 'invitation_received',
  //

  INVITE_FRIEND: "INVITE_FRIEND",
  GET_INVITATIONS: "GET_INVITATIONS",
  INVITATIONS_STATUS: "INVITATIONS_STATUS",
  INVITATION_RECEIVED: "INVITATION_RECEIVED",
  PROCESS_INVITATION: "PROCESS_INVITATION",
  //
  
  CREATE_LOBBY: "CREATE_LOBBY",// SERVEUR
  LEAVE_LOBBY: "LEAVE_LOBBY",// SERVEUR

  JOIN_LOBBY: "JOIN_LOBBY",// SERVEUR
  LOBBY_NOT_FOUND: "LOBBY_NOT_FOUND",// LOBBY 
  LOBBY_STATUS: "LOBBY_JOINED",// LOBBY
  PG_INVITATION: "PG_INVITATION",// SERVEUR
  RECEIVE_PG_INVITATION: "RECEIVE_PG_INVITATION",// LOBBY
  PROCESS_PG_INVITATION: "PROCESS_PG_INVITATION",// SERVEUR

  LOBBY_CREATED: "LOBBY_CREATED",// LOBBY
  LOBBY_LEAVE: "LOBBY_LEAVE",// LOBBY
  

  SWITCH_READY: "SWITCH_READY", // SERVEUR // LOBBY A VOIR
  READY_SWITCHED: "READY_SWITCHED", // LOBBY

  START_PG: "START_PG", // SERVEUR
  
  
  LINKING: "LINKING", // LOBBY
  PG_STARTED: "PG_STARTED", // LOBBY

  JOIN_PG_QUEUE: "JOIN_PG_QUEUE", // SERVEUR






} as const;



export type EVENT_TYPES = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type JOIN_QUEUE_R = typeof EVENT_TYPES.JOIN_QUEUE
export type LEAVE_QUEUE_R = typeof EVENT_TYPES.LEAVE_QUEUE
export type MATCH_MAKING_STATE = typeof EVENT_TYPES.MATCH_MAKING_STATE_R
export type INIT_GAME = typeof EVENT_TYPES.INIT_GAME
export type INCOMING_CATCH = typeof EVENT_TYPES.INCOMING_CATCH
export type MAKE_MOVE = typeof EVENT_TYPES.MAKE_MOVE
export type MATCH_STATE = typeof EVENT_TYPES.MATCH_STATE
export type MATCH_END = typeof EVENT_TYPES.MATCH_END
export type MAKE_MOVE_ACK = typeof EVENT_TYPES.MAKE_MOVE_ACK
export type MOVES = typeof EVENT_TYPES.MOVES
export type ATTACH = typeof EVENT_TYPES.ATTACH
export type FIRST_MOVE = typeof EVENT_TYPES.FIRST_MOVE
export type TIMER = typeof EVENT_TYPES.TIMER
export type NO_TIME = typeof EVENT_TYPES.NO_TIME
export type REQUEST_CHAT_HISTORY = typeof EVENT_TYPES.REQUEST_CHAT_HISTORY
export type GAME_END = typeof EVENT_TYPES.GAME_END
export type TIME_OUT = typeof EVENT_TYPES.TIME_OUT