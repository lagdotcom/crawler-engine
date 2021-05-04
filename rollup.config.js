import commonjs from "@rollup/plugin-commonjs";
import hmr from "rollup-plugin-hot";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import keysTransformer from "ts-transformer-keys/transformer";

const production = !process.env.ROLLUP_WATCH;

const output = [];
const plugins = [
  sourcemaps(),
  resolve({ browser: true }),
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

export default {
  input: pkg.main,
  output,
  plugins,
  watch: { clearScreen: false },
};
