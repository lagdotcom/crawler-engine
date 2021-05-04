import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Side,
} from "three";

import Component from "./Component";
import Engine from "./Engine";
import { CanMoveData } from "./Event";
import { getWall } from "./tools";
import WorldDef, { Cell, Surface } from "./WorldDef";
import XY from "./XY";

export default class World implements Component {
  engine!: Engine;
  group: Group;
  width: number;
  height: number;

  constructor(public def: WorldDef) {
    this.group = new Group();
    this.group.name = "World";

    this.height = def.cells.length;
    this.width = def.cells[0].length;
    this.construct();
    this.canMove = this.canMove.bind(this);
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
    const s = 0.5;

    const vertices = [-s, h, -s, s, h, -s, s, h, s, -s, h, s];
    const faces = [0, 1, 3, 1, 2, 3];

    return this.toFlat(faces, vertices, f.colour, side);
  }

  private makeHWall(f: Surface, ym: number, side: Side) {
    const s = 0.5;
    const h = this.def.ceiling;
    const l = this.def.floor;
    const y = ym * 0.5;

    const vertices = [-s, h, y, s, h, y, s, l, y, -s, l, y];
    const faces = [0, 1, 3, 1, 2, 3];

    return this.toFlat(faces, vertices, f.colour, side);
  }

  private makeVWall(f: Surface, xm: number, side: Side) {
    const s = 0.5;
    const h = this.def.ceiling;
    const l = this.def.floor;
    const x = xm * 0.5;

    const vertices = [x, h, s, x, h, -s, x, l, -s, x, l, s];
    const faces = [0, 1, 3, 1, 2, 3];

    return this.toFlat(faces, vertices, f.colour, side);
  }

  private toFlat(
    faces: number[],
    vertices: number[],
    color: number,
    side: Side
  ) {
    const geometry = new BufferGeometry();

    geometry.setIndex(faces);
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    // const material = new MeshLambertMaterial({ color, side });
    const material = new MeshBasicMaterial({ color, side });
    return new Mesh(geometry, material);
  }
}
