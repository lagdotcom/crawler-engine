type NoData = Record<string, never>;

export interface EventMap {
  update: { ms: number };
}

export type EventName = keyof EventMap;
