import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  Renderer,
  Scene,
  WebGLRenderer,
} from "three";

import Cardinal from "./Cardinal";
import Component from "./Component";
import CrawlCamera from "./CrawlCamera";
import EventHandler from "./EventHandler";
import World from "./World";
import WorldDef from "./WorldDef";

export default class Engine {
  events: EventHandler;
  components: Component[];
  renderer: Renderer;
  running: boolean;
  scene: Scene;
  time: number;
  view: CrawlCamera;
  world: World;

  constructor({
    innerWidth,
    innerHeight,
  }: {
    innerWidth: number;
    innerHeight: number;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).g = this;

    this.scene = new Scene();

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    this.renderer = renderer;

    this.view = new CrawlCamera({ ratio: innerWidth / innerHeight });
    this.components = [];

    this.events = new EventHandler();
    this.tick = this.tick.bind(this);
    this.time = 0;
  }

  get element(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  testCube(): void {
    const geometry = new BoxGeometry(0.4, 0.4, 0.4);
    const material = new MeshLambertMaterial();
    const cube = new Mesh(geometry, material);
    cube.position.x += 3;
    cube.position.y += 0.1;
    this.scene.add(cube);
    this.events.on("update", ({ ms }) => {
      cube.rotation.x += ms * 0.001;
      cube.rotation.y += ms * 0.002;
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
    this.view.attach(this);
    this.world.attach(this);
    this.components.forEach((m) => m.attach(this));
    requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    this.components.forEach((m) => m.detach(this));
    this.view.detach(this);
    this.world.detach(this);
  }

  use(def: WorldDef): void {
    this.world = new World(def);
  }

  placeCamera(x: number, y: number, dir: Cardinal): void {
    this.view.move(x, 0, y);
    this.view.face(dir);
  }
}
