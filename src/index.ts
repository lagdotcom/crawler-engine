import Cardinal from "./Cardinal";
import Engine from "./Engine";
import ResizeListener from "./ResizeListener";

window.addEventListener("load", () => {
  const engine = new Engine({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
  });
  document.body.append(engine.element);
  engine.components.push(new ResizeListener());

  const green = { colour: 0x00ff00, solid: true };
  const red = { colour: 0xff0000, solid: true };
  const blue = { colour: 0x0000ff, solid: true };
  const magenta = { colour: 0xff00ff, solid: true };
  const fake = { colour: 0, opacity: 0.9 };

  engine.world.use({
    start: [0, 0],
    face: Cardinal.East,
    floor: -0.2,
    ceiling: 0.5,
    cells: [
      [
        { floor: red, ceiling: red, north: magenta, south: green, west: blue },
        { floor: green, ceiling: green, east: red },
        { floor: blue, ceiling: blue, west: green },
        { floor: magenta, ceiling: magenta },
      ],
      [
        { floor: magenta, ceiling: magenta, north: fake },
        { floor: red, ceiling: red },
        { floor: green, ceiling: green },
        { floor: blue, ceiling: blue },
      ],
      [
        { floor: blue, ceiling: blue },
        { floor: magenta, ceiling: magenta },
        { floor: red, ceiling: red },
        { floor: green, ceiling: green },
      ],
      [
        { floor: green, ceiling: green },
        { floor: blue, ceiling: blue },
        { floor: magenta, ceiling: magenta },
        { floor: red, ceiling: red },
      ],
    ],
  });
  engine.testCube();

  engine.start();
});
