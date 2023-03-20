export const NAMESPACE_TYPES = {
  MATCH_MAKING: 'match-making',
  IN_GAME: 'in-game',
} as const;

export type NAMESPACE_TYPES = typeof NAMESPACE_TYPES[keyof typeof NAMESPACE_TYPES];

export type MATCH_MAKING = typeof NAMESPACE_TYPES.MATCH_MAKING;
export type IN_GAME = typeof NAMESPACE_TYPES.IN_GAME;


export const MATCHMAKING_MODE = {
  RANKED: 'ranked',
  UNRANKED: 'unranked',
  PRIVATE: 'private',
} as const;

export const MATCHMAKING_MODES_OPTIONS = {
  BULLET: 'bullet',
  BLITZ: 'blitz',
  RAPID: 'rapid',
} as const

export type MATCHMAKING_MODE = typeof MATCHMAKING_MODE[keyof typeof MATCHMAKING_MODE];

export type RANKED = typeof MATCHMAKING_MODE.RANKED;
export type UNRANKED = typeof MATCHMAKING_MODE.UNRANKED;
export type PRIVATE = typeof MATCHMAKING_MODE.PRIVATE;

export type MATCHMAKING_MODES_OPTIONS = typeof MATCHMAKING_MODES_OPTIONS[keyof typeof MATCHMAKING_MODES_OPTIONS];

export type BULLET = typeof MATCHMAKING_MODES_OPTIONS.BULLET;
export type BLITZ = typeof MATCHMAKING_MODES_OPTIONS.BLITZ;
export type RAPID = typeof MATCHMAKING_MODES_OPTIONS.RAPID;