import mapJson from "../res/wiz_lols_trials.json";
import Cardinal from "./Cardinal";
import Engine from "./Engine";
import loadGridCartographerJSON from "./GridCartographer";
import { Map as GCMap } from "./GridCartographer/schema";
import ResizeListener from "./ResizeListener";

window.addEventListener("load", () => {
  const engine = new Engine({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
  });
  document.body.append(engine.element);
  engine.components.push(new ResizeListener());

  const { cells, start } = loadGridCartographerJSON(mapJson as GCMap, 0, -1);
  console.log({ cells, start });

  engine.world.use({
    start: start || [0, 0],
    face: Cardinal.North,
    floor: -0.2,
    ceiling: 0.5,
    cells,
  });
  // engine.testCube();

  // engine.world.group.position.y = -17;
  // engine.view.camera.rotation.x = -Math.PI / 2;

  engine.start();
});
