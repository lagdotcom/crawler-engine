import Component from "./Component";
import Engine from "./Engine";

export default class ResizeListener implements Component {
  engine?: Engine;

  constructor() {
    window.addEventListener("resize", () => {
      if (this.engine)
        this.engine.resize(window.innerWidth, window.innerHeight);
    });
  }

  attach(e: Engine): void {
    this.engine = e;
  }

  detach(): void {
    this.engine = undefined;
  }
}
