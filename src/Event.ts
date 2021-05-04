import Cardinal from "./Cardinal";
import XY from "./XY";

type NoData = Record<string, never>;
export type CanMoveData = { from: XY; to: XY; dir: Cardinal; stop?: boolean };
export type UpdateData = { ms: number };

export interface EventMap {
  canMove: CanMoveData;
  update: UpdateData;
}

export type EventName = keyof EventMap;
