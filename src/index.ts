import Cardinal from "./Cardinal";
import Engine from "./Engine";

window.addEventListener("load", () => {
  const engine = new Engine(window);
  document.body.append(engine.element);

  const green = { colour: 0x00ff00 };
  const red = { colour: 0xff0000 };
  const blue = { colour: 0x0000ff };
  const purple = { colour: 0xff00ff };

  engine.use({
    start: [0, 0],
    face: Cardinal.East,
    floor: -0.2,
    ceiling: 0.5,
    cells: [
      [
        { floor: red, ceiling: red },
        { floor: green, ceiling: green },
        { floor: blue, ceiling: blue },
        { floor: purple, ceiling: purple },
      ],
      [
        { floor: purple, ceiling: purple },
        { floor: red, ceiling: red },
        { floor: green, ceiling: green },
        { floor: blue, ceiling: blue },
      ],
      [
        { floor: blue, ceiling: blue },
        { floor: purple, ceiling: purple },
        { floor: red, ceiling: red },
        { floor: green, ceiling: green },
      ],
      [
        { floor: green, ceiling: green },
        { floor: blue, ceiling: blue },
        { floor: purple, ceiling: purple },
        { floor: red, ceiling: red },
      ],
    ],
  });
  engine.testCube();

  engine.start();
});
