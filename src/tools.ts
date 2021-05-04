import Cardinal from "./Cardinal";
import { Cell, Surface } from "./WorldDef";
import XY from "./XY";

export function dirToOffset(d: Cardinal): XY {
  switch (d) {
    case Cardinal.North:
      return [0, -1];
    case Cardinal.East:
      return [1, 0];
    case Cardinal.South:
      return [0, 1];
    case Cardinal.West:
      return [-1, 0];
  }
}

const hpi = Math.PI / -2;
const angles = [0, hpi, hpi * 2, hpi * 3];
export function dirToAngle(d: Cardinal): number {
  return angles[d];
}

export function rotateCW(d: Cardinal): Cardinal {
  if (d === Cardinal.West) return Cardinal.North;
  return d + 1;
}

export function rotateCCW(d: Cardinal): Cardinal {
  if (d === Cardinal.North) return Cardinal.West;
  return d - 1;
}

export function turn180(d: Cardinal): Cardinal {
  switch (d) {
    case Cardinal.North:
      return Cardinal.South;
    case Cardinal.East:
      return Cardinal.West;
    case Cardinal.South:
      return Cardinal.North;
    case Cardinal.West:
      return Cardinal.East;
  }
}

export function addXY(a: XY, b: XY): XY {
  return [a[0] + b[0], a[1] + b[1]];
}

export function addXYC(p: XY, c: Cardinal): XY {
  return addXY(p, dirToOffset(c));
}

export function progress(s: number, e: number, c: number): number {
  if (c <= s) return 0;
  if (c >= e) return 1;

  return 1 - (e - c) / (e - s);
}

export function lerp(s: number, e: number, r: number): number {
  return s * (1 - r) + e * r;
}

export function lerpXY(s: XY, e: XY, ratio: number): XY {
  return [lerp(s[0], e[0], ratio), lerp(s[1], e[1], ratio)];
}

export function getWall(cell: Cell, dir: Cardinal): Surface | undefined {
  switch (dir) {
    case Cardinal.East:
      return cell.east;
    case Cardinal.North:
      return cell.north;
    case Cardinal.South:
      return cell.south;
    case Cardinal.West:
      return cell.west;
  }
}
