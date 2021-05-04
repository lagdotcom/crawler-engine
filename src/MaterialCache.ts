import { Material, MeshBasicMaterial, Side } from "three";

import AbstractCache from "./AbstractCache";

export default class MaterialCache extends AbstractCache<Material> {
  basic(color: number, side: Side, opacity = 1): Material {
    return this.get(`basic:${color}:${side}:${opacity}`, () => {
      if (opacity === 1) new MeshBasicMaterial({ color, side });
      return new MeshBasicMaterial({ color, side, transparent: true, opacity });
    });
  }
}
