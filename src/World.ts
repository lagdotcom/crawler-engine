import debug from "debug";
import { BackSide as BS, FrontSide as FS, Group, Mesh, Side } from "three";

import Component from "./Component";
import Engine from "./Engine";
import { MoveData } from "./Event";
import GeometryCache from "./GeometryCache";
import MaterialCache from "./MaterialCache";
import { getWall, gridAt } from "./tools";
import WorldDef, { Cell, Surface } from "./WorldDef";
import XY from "./XY";

export default class World implements Component {
  def!: WorldDef;
  engine!: Engine;
  group!: Group;
  log: debug.Debugger;
  height!: number;
  width!: number;

  constructor(
    private geo: GeometryCache,
    private mat: MaterialCache,
    def?: WorldDef
  ) {
    this.log = debug("world");
    this.canMove = this.canMove.bind(this);

    if (def) this.use(def);
  }

  use(def: WorldDef): void {
    this.def = def;
    this.group = new Group();
    this.group.name = "World";

    this.height = def.cells.length;
    this.width = def.cells[0].length;
    this.construct();
  }

  attach(e: Engine): void {
    this.engine = e;
    e.scene.add(this.group);
    e.events.on("canMove", this.canMove);

    e.placeCamera(this.def.start, this.def.face);
  }

  detach(e: Engine): void {
    e.scene.remove(this.group);
    e.events.off("canMove", this.canMove);
  }

  inBounds([x, y]: XY): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  cell(xy: XY): Cell | undefined {
    if (this.inBounds(xy)) {
      const [x, y] = xy;
      return this.def.cells[y][x];
    }
  }

  private canMove(e: MoveData) {
    if (!this.inBounds(e.to)) {
      e.stop = true;
      return;
    }

    const [sx, sy] = e.from;
    const src = this.def.cells[sy][sx];
    const wall = getWall(src, e.dir);
    if (wall?.solid) e.stop = true;

    const [dx, dy] = e.to;
    const dst = this.def.cells[dy][dx];
    if (!dst.floor?.solid) e.stop = true;
  }

  private construct() {
    this.log("creating geometry");

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const c = this.def.cells[y][x];
        const north = gridAt(this.def.cells, x, y - 1);
        const east = gridAt(this.def.cells, x + 1, y);
        const south = gridAt(this.def.cells, x, y + 1);
        const west = gridAt(this.def.cells, x - 1, y);

        this.makeCell(x, y, c, north, east, south, west);
      }
    }

    this.log("done: %d cells", this.group.children.length);
  }

  private makeCell(
    x: number,
    y: number,
    c: Cell,
    nc?: Cell,
    ec?: Cell,
    sc?: Cell,
    wc?: Cell
  ) {
    const cell = new Group();
    const e = c.elevation;
    const fl = this.def.floor;
    const ce = this.def.ceiling;

    if (c.floor) cell.add(this.makeFlat(c.floor, this.def.floor, BS));
    if (c.ceiling) cell.add(this.makeFlat(c.ceiling, this.def.ceiling, FS));
    if (c.north) cell.add(this.makeHWall(c.north, -1, BS));
    if (c.south) cell.add(this.makeHWall(c.south, 1, FS));
    if (c.west) cell.add(this.makeVWall(c.west, -1, BS));
    if (c.east) cell.add(this.makeVWall(c.east, 1, FS));

    // TODO: colour??
    const fills = { colour: 0xffffff };

    // TODO: slopes instead of steps???
    if (nc && nc.elevation > e) {
      cell.add(this.makeHWall(fills, -1, BS, nc.elevation - e + fl, fl));

      if (c.ceiling)
        cell.add(this.makeHWall(fills, -1, FS, nc.elevation - e + ce, ce));
    }

    if (sc && sc.elevation > e) {
      cell.add(this.makeHWall(fills, 1, FS, sc.elevation - e + fl, fl));

      if (c.ceiling)
        cell.add(this.makeHWall(fills, 1, BS, sc.elevation - e + ce, ce));
    }

    if (wc && wc.elevation > e) {
      cell.add(this.makeVWall(fills, -1, BS, wc.elevation - e + fl, fl));

      if (c.ceiling)
        cell.add(this.makeVWall(fills, -1, FS, wc.elevation - e + ce, ce));
    }

    if (ec && ec.elevation > e) {
      cell.add(this.makeVWall(fills, 1, FS, ec.elevation - e + fl, fl));

      if (c.ceiling)
        cell.add(this.makeVWall(fills, 1, BS, ec.elevation - e + ce, ce));
    }

    if (cell.children.length) {
      cell.position.set(x, e, y);
      cell.name = `${x},${y}`;
      this.group.add(cell);
    }
  }

  private makeFlat(f: Surface, h: number, side: Side) {
    return new Mesh(
      this.geo.flat(h),
      this.mat.basic(f.colour, side, f.opacity)
    );
  }

  private makeHWall(
    f: Surface,
    ym: number,
    side: Side,
    ce = this.def.ceiling,
    fl = this.def.floor
  ) {
    return new Mesh(
      this.geo.horizontal(ym * 0.5, ce, fl),
      this.mat.basic(f.colour, side, f.opacity)
    );
  }

  private makeVWall(
    f: Surface,
    xm: number,
    side: Side,
    ce = this.def.ceiling,
    fl = this.def.floor
  ) {
    return new Mesh(
      this.geo.vertical(xm * 0.5, ce, fl),
      this.mat.basic(f.colour, side, f.opacity)
    );
  }
}
