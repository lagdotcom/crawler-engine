import Cardinal from "./Cardinal";

export type XY = [x: number, y: number];

export interface Surface {
  colour: number;
}

export interface Cell {
  ceiling?: Surface;
  floor?: Surface;
  north?: Surface;
  east?: Surface;
  south?: Surface;
  west?: Surface;
}

export default interface WorldDef {
  start: XY;
  face: Cardinal;
  floor: number;
  ceiling: number;
  cells: Cell[][];
}
