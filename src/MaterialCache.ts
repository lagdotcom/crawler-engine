import { Material, MeshPhongMaterial as Mat, Side } from "three";

import AbstractCache from "./AbstractCache";

export default class MaterialCache extends AbstractCache<Material> {
  basic(color: number, side: Side, opacity = 1): Material {
    return this.get(`basic:${color}:${side}:${opacity}`, () => {
      if (opacity === 1) new Mat({ color, side });
      return new Mat({ color, side, transparent: true, opacity });
    });
  }
}
