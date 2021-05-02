import { PerspectiveCamera, PointLight } from "three";

import Cardinal, { dirToAngle, rotateCCW, rotateCW } from "./Cardinal";
import Component from "./Component";
import Engine from "./Engine";

interface CrawlCameraSettings {
  facing?: Cardinal;
  fov?: number;
  ratio: number;
  intensity?: number;
  distance?: number;
  bobSpeed?: number;
  bobAmount?: number;
  turnDuration?: number;
}

const hpi = Math.PI / 2;

export default class CrawlCamera implements Component {
  bobSpeed: number;
  bobAmount: number;
  camera: PerspectiveCamera;
  engine: Engine;
  facing: Cardinal;
  light: PointLight;
  turnDuration: number;

  turning: boolean;
  turnUntil: number;
  turnStep: number;
  turnTo: Cardinal;
  turnCheck: (angle: number) => boolean;

  constructor({
    facing = Cardinal.East,
    fov = 70,
    ratio,
    intensity = 5,
    distance = 10,
    bobSpeed = 0.002,
    bobAmount = 0.01,
    turnDuration = 500,
  }: CrawlCameraSettings) {
    this.camera = new PerspectiveCamera(fov, ratio);
    this.light = new PointLight(0xffffff, intensity, distance);
    this.facing = facing;
    this.bobSpeed = bobSpeed;
    this.bobAmount = bobAmount;
    this.turnDuration = turnDuration;
    this.camera.add(this.light);
    this.tick = this.tick.bind(this);
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

  tick({ ms }: { ms: number }): void {
    this.camera.position.y =
      Math.sin(this.engine.time * this.bobSpeed) * this.bobAmount;

    if (this.turning) {
      const angle = this.camera.rotation.y + this.turnStep * ms;
      if (this.turnCheck(angle)) {
        this.turning = false;
        this.face(this.turnTo);
      } else this.camera.rotation.y = angle;
    }
  }

  move(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  face(dir: Cardinal): void {
    this.facing = dir;
    this.camera.rotation.y = dirToAngle(dir);
    // this.light.rotation.copy(this.camera.rotation);
  }

  private turnBy(change: number) {
    this.turnUntil = this.camera.rotation.y + change;
    this.turnStep = change / this.turnDuration;
    if (change > 0) this.turnCheck = (ang) => ang >= this.turnUntil;
    else this.turnCheck = (ang) => ang <= this.turnUntil;
    this.turning = true;
  }

  turnR(): void {
    this.turnTo = rotateCW(this.facing);
    return this.turnBy(-hpi);
  }

  turnL(): void {
    this.turnTo = rotateCCW(this.facing);
    return this.turnBy(hpi);
  }
}
