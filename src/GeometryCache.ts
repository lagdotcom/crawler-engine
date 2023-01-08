import { BufferGeometry, PlaneGeometry } from "three";

import AbstractCache from "./AbstractCache";

const hpi = Math.PI / 2;

export default class GeometryCache extends AbstractCache<BufferGeometry> {
  flat(h: number): BufferGeometry {
    return this.get(`f${h}`, () =>
      new PlaneGeometry(1, 1).rotateX(hpi).translate(0, h, 0)
    );
  }

  horizontal(y: number, h: number, l: number): BufferGeometry {
    return this.get(`h${y}:${h}:${l}`, () =>
      new PlaneGeometry(1, h - l).rotateX(Math.PI).translate(0, (h + l) / 2, y)
    );
  }

  vertical(x: number, h: number, l: number): BufferGeometry {
    return this.get(`v${x}:${h}:${l}`, () =>
      new PlaneGeometry(1, h - l).rotateY(-hpi).translate(x, (h + l) / 2, 0)
    );
  }
}
