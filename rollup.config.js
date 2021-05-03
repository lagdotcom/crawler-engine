import commonjs from "@rollup/plugin-commonjs";
import file from "rollup-plugin-import-file";
import hmr from "rollup-plugin-hot";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-node-polyfills";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import url from "@rollup/plugin-url";

const production = !process.env.ROLLUP_WATCH;
const outputDir = production ? "dist" : "demo";

const output = [];
const plugins = [
  nodePolyfills(),
  json({ preferConst: true }),
  file({ output: outputDir, extensions: /\.mp3/ }),
  url({ limit: 30 * 1024 }),
  sourcemaps(),
  resolve(),
  commonjs(),
  typescript({ tsconfigDefaults: { sourceMap: true } }),
];
if (process.env.ROLLUP_WATCH) {
  output.push({
    sourcemap: true,
    file: "demo/bundle.js",
    format: "iife",
    exports: "named",
  });
  plugins.push(hmr({ public: "demo", baseUrl: "/" }));
  plugins.push(serve({ contentBase: "demo", open: true }));
} else {
  output.push({
    file: "dist/bundle.min.js",
    format: "iife",
    exports: "named",
    plugins: [terser()],
  });
}

export default { input: pkg.main, output, plugins };
