import { KeyInputHandler } from "@lagdotcom/simple-inputs";

import Cardinal from "./Cardinal";
import Component from "./Component";
import Engine from "./Engine";
import Input from "./Input";
import { addXYC, rotateCCW, rotateCW, turn180 } from "./tools";

export default class InputHandler implements Component {
  engine!: Engine;
  keys: KeyInputHandler<Input>;
  waiting?: Input;

  constructor() {
    this.translator = this.translator.bind(this);
    this.listener = this.listener.bind(this);
    this.update = this.update.bind(this);
    this.keys = new KeyInputHandler(this.translator, this.listener, {
      enabled: true,
      events: ["keydown", "keyup"],
    });
  }

  attach(e: Engine): void {
    this.engine = e;
    this.keys.enabled = true;
    e.events.on("update", this.update);
  }

  detach(): void {
    this.keys.enabled = false;
    this.engine.events.off("update", this.update);
  }

  translator(e: KeyboardEvent): Input | undefined {
    if (e.type === "keyup") {
      this.waiting = undefined;
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        return { type: "advance" };
      case "ArrowDown":
        return { type: "back" };
      case "ArrowLeft":
        if (e.shiftKey) return { type: "slide", direction: "l" };
        return { type: "turn", direction: "l" };
      case "ArrowRight":
        if (e.shiftKey) return { type: "slide", direction: "r" };
        return { type: "turn", direction: "r" };
    }
  }

  listener(e: Input): void {
    if (this.engine.view.busy) {
      this.waiting = e;
      return;
    }

    const dir = this.engine.view.facing;
    switch (e.type) {
      case "advance":
        return this.move(dir);
      case "back":
        return this.move(turn180(dir));
      case "slide":
        return this.move(e.direction === "l" ? rotateCCW(dir) : rotateCW(dir));
      case "turn":
        return e.direction === "l"
          ? this.engine.view.turnL()
          : this.engine.view.turnR();
    }
  }

  move(dir: Cardinal): void {
    const from = this.engine.view.position;
    const to = addXYC(this.engine.view.position, dir);

    const result = this.engine.events.emit("canMove", { from, to, dir });
    if (result.stop) return;

    this.engine.view.move(to, dir);
  }

  update() {
    if (this.waiting && !this.engine.view.busy) {
      this.listener(this.waiting);
      this.waiting = undefined;
    }
  }
}
