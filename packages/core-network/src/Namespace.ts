export const NAMESPACE_TYPES = {
  MM_RANKED: 'mm-ranked',
  MM_UNRANKED: 'mm-unranked',
} as const;

export type NAMESPACE_TYPES = typeof NAMESPACE_TYPES[keyof typeof NAMESPACE_TYPES];

export type MM_RANKED = typeof NAMESPACE_TYPES.MM_RANKED;
export type MM_UNRANKED = typeof NAMESPACE_TYPES.MM_UNRANKED;