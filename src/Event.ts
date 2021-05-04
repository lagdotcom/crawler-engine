import Cardinal from "./Cardinal";
import XY from "./XY";

// type NoData = Record<string, never>;
export type MoveData = { from: XY; to: XY; dir: Cardinal; stop?: boolean };
export type PosData = { pos: XY };
export type TurnData = { from: Cardinal; to: Cardinal };
export type UpdateData = { ms: number };

export interface EventMap {
  canMove: MoveData;
  entered: PosData;
  left: PosData;
  moved: MoveData;
  turning: TurnData;
  turned: TurnData;
  update: UpdateData;
}

export type EventName = keyof EventMap;
