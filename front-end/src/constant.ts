export const GUARD_TYPES = ['default', 'guest', 'auth'] as const;

export type GuardType = typeof GUARD_TYPES[number];
