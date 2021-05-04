import { Material, MeshBasicMaterial, Side } from "three";

import AbstractCache from "./AbstractCache";

export default class MaterialCache extends AbstractCache<Material> {
  basic(color: number, side: Side): Material {
    return this.get(
      `basic:${color}:${side}`,
      () => new MeshBasicMaterial({ color, side })
    );
  }
}
