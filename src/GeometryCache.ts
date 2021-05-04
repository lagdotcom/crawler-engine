import { BufferAttribute, BufferGeometry } from "three";

import AbstractCache from "./AbstractCache";

export default class GeometryCache extends AbstractCache<BufferGeometry> {
  flat(h: number): BufferGeometry {
    return this.get(`f${h}`, () => {
      const s = 0.5;
      const vertices = [-s, h, -s, s, h, -s, s, h, s, -s, h, s];
      const faces = [0, 1, 3, 1, 2, 3];

      return this.asGeometry(faces, vertices);
    });
  }

  horizontal(y: number, h: number, l: number): BufferGeometry {
    return this.get(`h${y}:${h}:${l}`, () => {
      const s = 0.5;

      const vertices = [-s, h, y, s, h, y, s, l, y, -s, l, y];
      const faces = [0, 1, 3, 1, 2, 3];

      return this.asGeometry(faces, vertices);
    });
  }

  vertical(x: number, h: number, l: number): BufferGeometry {
    return this.get(`v${x}:${h}:${l}`, () => {
      const s = 0.5;

      const vertices = [x, h, s, x, h, -s, x, l, -s, x, l, s];
      const faces = [0, 1, 3, 1, 2, 3];

      return this.asGeometry(faces, vertices);
    });
  }

  private asGeometry(faces: number[], vertices: number[]) {
    const geometry = new BufferGeometry();

    geometry.setIndex(faces);
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3)
    );

    return geometry;
  }
}
