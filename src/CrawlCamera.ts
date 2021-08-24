import { PerspectiveCamera, PointLight } from "three";

import Cardinal from "./Cardinal";
import Component from "./Component";
import Engine from "./Engine";
import {
  dirToAngle,
  lerp,
  lerpXY,
  progress,
  rotateCCW,
  rotateCW,
} from "./tools";
import XY from "./XY";

interface CrawlCameraSettings {
  facing?: Cardinal;
  fov?: number;
  ratio: number;
  intensity?: number;
  distance?: number;
  bobSpeed?: number;
  bobAmount?: number;
  turnDuration?: number;
  position?: XY;
  moveDuration?: number;
}

const hpi = Math.PI / 2;

export default class CrawlCamera implements Component {
  bobSpeed: number;
  bobAmount: number;
  camera: PerspectiveCamera;
  engine!: Engine;
  facing: Cardinal;
  light: PointLight;
  position!: XY;
  turnDuration: number;
  moveDuration: number;

  turning!: boolean;
  turnFrom!: number;
  turnTo!: number;
  turnStart!: number;
  turnEnd!: number;
  turnDir!: Cardinal;

  moving!: boolean;
  moveStart!: number;
  moveTo!: XY;
  moveEnd!: number;
  moveDir!: Cardinal;

  get busy(): boolean {
    return this.turning || this.moving;
  }

  constructor({
    facing = Cardinal.East,
    fov = 70,
    ratio,
    intensity = 0.4,
    distance = 4,
    bobSpeed = 0.002,
    bobAmount = 0.01,
    turnDuration = 500,
    moveDuration = 500,
    position = [0, 0],
  }: CrawlCameraSettings) {
    this.camera = new PerspectiveCamera(fov, ratio);
    this.light = new PointLight(0xffffff, intensity, distance);
    this.facing = facing;
    this.bobSpeed = bobSpeed;
    this.bobAmount = bobAmount;
    this.turnDuration = turnDuration;
    this.moveDuration = moveDuration;

    this.camera.add(this.light);
    this.tick = this.tick.bind(this);
    this.setPosition(position);
  }

  attach(e: Engine): void {
    this.engine = e;
    e.scene.add(this.camera);
    e.events.on("update", this.tick);
  }

  detach(e: Engine): void {
    e.scene.remove(this.camera);
    e.events.off("update", this.tick);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  tick(): void {
    const t = this.engine.time;
    const bob = Math.sin(t * this.bobSpeed) * this.bobAmount;

    if (this.turning) {
      if (t >= this.turnEnd) {
        this.turning = false;
        this.engine.events.emit("turned", {
          from: this.facing,
          to: this.turnDir,
        });
        this.face(this.turnDir);
      } else {
        const ratio = progress(this.turnStart, this.turnEnd, t);
        const angle = lerp(this.turnFrom, this.turnTo, ratio);
        this.camera.rotation.y = angle;
      }
    }

    if (this.moving) {
      if (t >= this.moveEnd) {
        this.moving = false;
        this.engine.events.emit("moved", {
          from: this.position,
          to: this.moveTo,
          dir: this.moveDir,
        });

        this.setPosition(this.moveTo);
        this.engine.events.emit("entered", { pos: this.position });
      } else {
        const ratio = progress(this.moveStart, this.moveEnd, t);
        const pos = lerpXY(this.position, this.moveTo, ratio);
        this.camera.position.set(pos[0], bob, pos[1]);
      }
    } else this.camera.position.y = bob;
  }

  setPosition(pos: XY): void {
    this.position = pos;
    this.camera.position.x = pos[0];
    this.camera.position.z = pos[1];
  }

  face(dir: Cardinal): void {
    this.facing = dir;
    this.camera.rotation.y = dirToAngle(dir);
  }

  private turnBy(change: number) {
    this.engine.events.emit("turning", { from: this.facing, to: this.turnDir });

    this.turnFrom = this.camera.rotation.y;
    this.turnTo = this.turnFrom + change;
    this.turnStart = this.engine.time;
    this.turnEnd = this.turnStart + this.turnDuration;
    this.turning = true;
  }

  turnR(): void {
    this.turnDir = rotateCW(this.facing);
    return this.turnBy(-hpi);
  }

  turnL(): void {
    this.turnDir = rotateCCW(this.facing);
    return this.turnBy(hpi);
  }

  move(pos: XY, dir: Cardinal): void {
    this.engine.events.emit("left", { pos: this.position });

    this.moveTo = pos;
    this.moveStart = this.engine.time;
    this.moveEnd = this.moveStart + this.moveDuration;
    this.moveDir = dir;
    this.moving = true;
  }
}
