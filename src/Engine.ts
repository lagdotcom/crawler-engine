import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  Scene,
  WebGLRenderer,
} from "three";

import Cardinal from "./Cardinal";
import Component from "./Component";
import CrawlCamera from "./CrawlCamera";
import { UpdateData } from "./Event";
import EventHandler from "./EventHandler";
import GeometryCache from "./GeometryCache";
import InputHandler from "./InputHandler";
import MaterialCache from "./MaterialCache";
import World from "./World";
import XY from "./XY";

interface EngineOptions {
  width: number;
  height: number;
  pixelRatio?: number;
}

export default class Engine {
  components: Component[];
  events: EventHandler;
  geo: GeometryCache;
  inputs: InputHandler;
  mat: MaterialCache;
  renderer: WebGLRenderer;
  running: boolean;
  scene: Scene;
  time: number;
  view: CrawlCamera;
  world: World;

  constructor(o: EngineOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).g = this;

    this.scene = new Scene();

    this.renderer = new WebGLRenderer({ antialias: true });
    if (o.pixelRatio) this.renderer.setPixelRatio(o.pixelRatio);
    this.renderer.setSize(o.width, o.height);

    this.geo = new GeometryCache();
    this.mat = new MaterialCache();
    this.view = new CrawlCamera({ ratio: o.width / o.height });
    this.world = new World(this.geo, this.mat);
    this.events = new EventHandler();
    this.inputs = new InputHandler();
    this.tick = this.tick.bind(this);
    this.running = false;
    this.time = 0;

    this.components = [this.view, this.world, this.inputs];
  }

  get element(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.view.resize(width, height);
  }

  testCube(): void {
    const geometry = new BoxGeometry(0.4, 0.4, 0.4);
    const material = new MeshLambertMaterial();
    const cube = new Mesh(geometry, material);
    cube.position.x += 3;
    cube.position.y += 0.1;
    this.scene.add(cube);

    const cubeUpdate = ({ ms }: UpdateData) => {
      cube.rotation.x += ms * 0.001;
      cube.rotation.y += ms * 0.002;
    };
    this.components.push({
      attach: (e) => e.events.on("update", cubeUpdate),
      detach: (e) => e.events.off("update", cubeUpdate),
    });
  }

  private tick(t: number) {
    const ms = t - this.time;
    this.time = t;
    this.events.emit("update", { ms });

    this.renderer.render(this.scene, this.view.camera);
    if (this.running) requestAnimationFrame(this.tick);
  }

  start(): void {
    this.running = true;
    this.components.forEach((m) => m.attach(this));
    requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    this.components.forEach((m) => m.detach(this));
  }

  placeCamera(pos: XY, dir: Cardinal): void {
    this.view.setPosition(pos);
    this.view.face(dir);
  }
}
