import { BackSide, FrontSide, Group, Mesh, Side } from "three";

import Component from "./Component";
import Engine from "./Engine";
import { CanMoveData } from "./Event";
import GeometryCache from "./GeometryCache";
import MaterialCache from "./MaterialCache";
import { getWall } from "./tools";
import WorldDef, { Cell, Surface } from "./WorldDef";
import XY from "./XY";

export default class World implements Component {
  def!: WorldDef;
  engine!: Engine;
  group!: Group;
  height!: number;
  width!: number;

  constructor(
    private geo: GeometryCache,
    private mat: MaterialCache,
    def: WorldDef = {
      start: [0, 0],
      face: 0,
      floor: 0,
      ceiling: 1,
      cells: [[]],
    }
  ) {
    this.canMove = this.canMove.bind(this);
    this.use(def);
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

    const [x, y] = this.def.start;
    e.placeCamera(x, y, this.def.face);
  }

  detach(e: Engine): void {
    e.scene.remove(this.group);
    e.events.off("canMove", this.canMove);
  }

  inBounds([x, y]: XY): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private canMove(e: CanMoveData) {
    if (!this.inBounds(e.to)) {
      e.stop = true;
      return;
    }

    const [x, y] = e.from;
    const cell = this.def.cells[y][x];
    const wall = getWall(cell, e.dir);
    if (wall?.solid) e.stop = true;
  }

  private construct() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const c = this.def.cells[y][x];
        this.makeCell(x, y, c);
      }
    }
  }

  private makeCell(x: number, y: number, c: Cell) {
    const cell = new Group();

    if (c.floor) cell.add(this.makeFlat(c.floor, this.def.floor, BackSide));
    if (c.ceiling)
      cell.add(this.makeFlat(c.ceiling, this.def.ceiling, FrontSide));
    if (c.north) cell.add(this.makeHWall(c.north, -1, BackSide));
    if (c.south) cell.add(this.makeHWall(c.south, 1, FrontSide));
    if (c.west) cell.add(this.makeVWall(c.west, -1, BackSide));
    if (c.east) cell.add(this.makeVWall(c.east, 1, FrontSide));

    if (cell.children.length) {
      cell.position.set(x, 0, y);
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

  private makeHWall(f: Surface, ym: number, side: Side) {
    return new Mesh(
      this.geo.horizontal(ym * 0.5, this.def.ceiling, this.def.floor),
      this.mat.basic(f.colour, side, f.opacity)
    );
  }

  private makeVWall(f: Surface, xm: number, side: Side) {
    return new Mesh(
      this.geo.vertical(xm * 0.5, this.def.ceiling, this.def.floor),
      this.mat.basic(f.colour, side, f.opacity)
    );
  }
}
