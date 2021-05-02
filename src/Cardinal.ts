import { XY } from "./WorldDef";

enum Cardinal {
  North,
  East,
  South,
  West,
}
export default Cardinal;

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
