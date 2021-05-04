import Cardinal from "./Cardinal";
import XY from "./XY";

export interface Surface {
  colour: number;
  opacity?: number;
  solid?: boolean;
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
