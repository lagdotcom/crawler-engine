import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
} from "three";

import Component from "./Component";
import Engine from "./Engine";
import WorldDef, { Cell, Surface } from "./WorldDef";

export default class World implements Component {
  engine: Engine;
  group: Group;

  constructor(public def: WorldDef) {
    this.group = new Group();
    this.group.name = "World";

    this.construct();
  }

  attach(e: Engine): void {
    this.engine = e;
    e.scene.add(this.group);

    const [x, y] = this.def.start;
    e.placeCamera(x, y, this.def.face);
  }

  detach(e: Engine): void {
    e.scene.remove(this.group);
  }

  private construct() {
    for (let y = 0; y < this.def.cells.length; y++) {
      for (let x = 0; x < this.def.cells[y].length; x++) {
        const c = this.def.cells[y][x];
        this.makeCell(x, y, c);
      }
    }
  }

  private makeCell(x: number, y: number, c: Cell) {
    const cell = new Group();

    if (c.floor) cell.add(this.makeFlat(c.floor, this.def.floor));
    if (c.ceiling) cell.add(this.makeFlat(c.ceiling, this.def.ceiling));

    if (cell.children.length) {
      cell.position.set(x, 0, y);
      cell.name = `${x},${y}`;
      this.group.add(cell);
    }
  }

  private makeFlat(f: Surface, h: number) {
    const s = 0.5;

    const geometry = new BufferGeometry();
    const vertices = [-s, h, -s, s, h, -s, s, h, s, -s, h, s];
    const faces = [0, 1, 3, 1, 2, 3];

    geometry.setIndex(faces);
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    // const material = new MeshLambertMaterial({
    //   color: f.colour,
    //   side: DoubleSide,
    // });
    const material = new MeshBasicMaterial({
      color: f.colour,
      side: DoubleSide,
    });
    return new Mesh(geometry, material);
  }
}
