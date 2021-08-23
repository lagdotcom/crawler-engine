import commonjs from "@rollup/plugin-commonjs";
import hmr from "rollup-plugin-hot";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import keysTransformer from "ts-transformer-keys/transformer";

// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;

/** @type {import('rollup').OutputOptions[]} */
const output = [];
/** @type {import('rollup').Plugin[]} */
const plugins = [
  sourcemaps(),
  resolve({ browser: true }),
  json(),
  typescript({
    tsconfigDefaults: { sourceMap: true },
    transformers: [
      (service) => ({
        before: [keysTransformer(service.getProgram())],
        after: [],
      }),
    ],
  }),
  commonjs(),
];
if (!production) {
  output.push({
    sourcemap: true,
    file: "demo/bundle.js",
    format: "iife",
    exports: "named",
  });
  plugins.push(hmr({ public: "demo" }));
  plugins.push(serve({ contentBase: "demo", open: true }));
} else {
  output.push({
    file: "dist/bundle.min.js",
    format: "iife",
    exports: "named",
    plugins: [terser()],
  });
}

/** @type {import('rollup').RollupOptions} */
const options = {
  input: pkg.main,
  output,
  plugins,
  watch: { clearScreen: false },
};
export default options;
