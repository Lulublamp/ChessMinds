export const CoreEvents = {
  JOIN_QUEUE_R: 'JOIN_QUEUE',
  LEAVE_QUEUE_R: 'LEAVE_QUEUE',
  MATCH_MAKING_STATE_R: 'MATCH_MAKING_STATE',
  INIT_GAME: 'INIT_GAME',
  INCOMING_CATCH: 'INCOMING_CATCH',
} as const;



export type EVENT_TYPES = typeof CoreEvents[keyof typeof CoreEvents];

export type JOIN_QUEUE_R = typeof CoreEvents.JOIN_QUEUE_R
export type LEAVE_QUEUE_R = typeof CoreEvents.LEAVE_QUEUE_R
export type MATCH_MAKING_STATE = typeof CoreEvents.MATCH_MAKING_STATE_R
export type INIT_GAME = typeof CoreEvents.INIT_GAME
export type INCOMING_CATCH = typeof CoreEvents.INCOMING_CATCH

