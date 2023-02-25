export const CoreEvents = {
  JOIN_QUEUE_R: 'JOIN_QUEUE',
  LEAVE_QUEUE_R: 'LEAVE_QUEUE',
  MATCH_MAKING_STATE_R: 'MATCH_MAKING_STATE',
} as const;

export type EVENT_TYPES = typeof CoreEvents[keyof typeof CoreEvents];