export const NAMESPACE_TYPES = {
  MATCH_MAKING: "match-making",
  IN_GAME: "in-game",
  PRIVATE_LOBBY: "private-lobby",
} as const;

export type NAMESPACE_TYPES =
  (typeof NAMESPACE_TYPES)[keyof typeof NAMESPACE_TYPES];

export type MATCH_MAKING = typeof NAMESPACE_TYPES.MATCH_MAKING;
export type IN_GAME = typeof NAMESPACE_TYPES.IN_GAME;

export const MATCHMAKING_MODE = {
  RANKED: "ranked",
  UNRANKED: "unranked",
  PRIVATE: "private",
} as const;

export const MATCHMAKING_MODES_TIMERS = {
  BULLET: "bullet",
  BLITZ: "blitz",
  RAPID: "rapid",
} as const;

export type MATCHMAKING_MODE =
  (typeof MATCHMAKING_MODE)[keyof typeof MATCHMAKING_MODE];

export type RANKED = typeof MATCHMAKING_MODE.RANKED;
export type UNRANKED = typeof MATCHMAKING_MODE.UNRANKED;
export type PRIVATE = typeof MATCHMAKING_MODE.PRIVATE;

export type MATCHMAKING_MODES_TIMERS =
  (typeof MATCHMAKING_MODES_TIMERS)[keyof typeof MATCHMAKING_MODES_TIMERS];

export type BULLET = typeof MATCHMAKING_MODES_TIMERS.BULLET;
export type BLITZ = typeof MATCHMAKING_MODES_TIMERS.BLITZ;
export type RAPID = typeof MATCHMAKING_MODES_TIMERS.RAPID;
