import { makeGrid } from "../tools";
import WorldDef, { Cell } from "../WorldDef";
import { Edge, Marker } from "./enums";
import { Map } from "./schema";

type PartialDef = {
  cells: WorldDef["cells"];
  start?: WorldDef["start"];
};

export default function loadGridCartographerJSON(
  j: Map,
  region = 0,
  floor = 0
): PartialDef {
  const palette = j.palette;
  if (!palette) throw new Error("Embedded palette required (for now)");

  const r = j.regions[region];
  if (r.setup.origin !== "bl")
    throw new Error("Bottom left origin required (for now)");

  const f = r.floors.find((f) => f.index === floor);
  if (!f) throw new Error(`Unknown region/floor: ${region}/${floor}`);

  const ox = f.tiles.bounds.x0;
  const oy = f.tiles.bounds.y0;
  const w = f.tiles.bounds.width;
  const h = f.tiles.bounds.height;

  const cells = makeGrid<Cell>(w, h, () => ({}));
  let start = undefined;

  const cnv = (wx: number, wy: number) => {
    const x = wx + ox;
    const iy = wy + oy;
    const y = h - iy - 1;

    return [x, y];
  };

  const at = (wx: number, wy: number) => {
    const [x, y] = cnv(wx, wy);

    if (y < 0 || y >= h || x < 0 || x >= w) return undefined;
    return cells[y][x];
  };

  const pal = (i: number) => parseInt(palette[i].rgb.substr(1), 16);

  const dark = 0x101010;
  const norm = 0x202020;

  f.tiles.rows?.forEach((r) => {
    let x = r.start;
    r.tdata.forEach((t) => {
      if (t.m === Marker.Exit) start = cnv(x, r.y);

      const mt = at(x, r.y);
      if (t.t && mt)
        mt.floor = t.d
          ? { colour: dark, opacity: 1, solid: true }
          : { colour: norm, opacity: 1, solid: true };

      if (t.b) {
        const ut = at(x, r.y);
        const bt = at(x, r.y - 1);
        const colour = pal(t.bc || 0);

        switch (t.b) {
          case Edge.Wall:
            if (ut) ut.south = { colour, opacity: 1, solid: true };
            if (bt) bt.north = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_Secret:
          case Edge.Wall_Secret:
            if (ut) ut.south = { colour, opacity: 1 };
            if (bt) bt.north = { colour, opacity: 1 };
            break;

          case Edge.Door:
          case Edge.Door_Locked:
          case Edge.Gate:
            if (ut) ut.south = { colour, opacity: 0.5 };
            if (bt) bt.north = { colour, opacity: 0.5 };
            break;

          case Edge.Wall_OneWayLU:
            if (ut) ut.south = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_OneWayLU:
            if (ut) ut.south = { colour, opacity: 1, solid: true };
            if (bt) bt.north = { colour, opacity: 0.5 };
            break;

          case Edge.Door_Hidden_OneWayLU:
            if (ut) ut.south = { colour, opacity: 1, solid: true };
            if (bt) bt.north = { colour, opacity: 1 };
            break;

          case Edge.Wall_OneWayRD:
            if (bt) bt.north = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_OneWayRD:
            if (ut) ut.south = { colour, opacity: 0.5 };
            if (bt) bt.north = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_Hidden_OneWayRD:
            if (ut) ut.south = { colour, opacity: 1 };
            if (bt) bt.north = { colour, opacity: 1, solid: true };
            break;
        }
      }

      if (t.r) {
        const lt = at(x, r.y);
        const rt = at(x + 1, r.y);
        const colour = pal(t.rc || 0);

        switch (t.r) {
          case Edge.Wall:
            if (lt) lt.east = { colour, opacity: 1, solid: true };
            if (rt) rt.west = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_Secret:
          case Edge.Wall_Secret:
            if (lt) lt.east = { colour, opacity: 1 };
            if (rt) rt.west = { colour, opacity: 1 };
            break;

          case Edge.Door:
          case Edge.Door_Locked:
          case Edge.Gate:
            if (lt) lt.east = { colour, opacity: 0.5 };
            if (rt) rt.west = { colour, opacity: 0.5 };
            break;

          case Edge.Wall_OneWayLU:
            if (lt) lt.east = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_OneWayLU:
            if (lt) lt.east = { colour, opacity: 1, solid: true };
            if (rt) rt.west = { colour, opacity: 0.5 };
            break;

          case Edge.Door_Hidden_OneWayLU:
            if (lt) lt.east = { colour, opacity: 1, solid: true };
            if (rt) rt.west = { colour, opacity: 1 };
            break;

          case Edge.Wall_OneWayRD:
            if (rt) rt.west = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_OneWayRD:
            if (lt) lt.east = { colour, opacity: 0.5 };
            if (rt) rt.west = { colour, opacity: 1, solid: true };
            break;

          case Edge.Door_Hidden_OneWayRD:
            if (lt) lt.east = { colour, opacity: 1 };
            if (rt) rt.west = { colour, opacity: 1, solid: true };
            break;
        }
      }

      x++;
    });
  });

  return { cells, start };
}
