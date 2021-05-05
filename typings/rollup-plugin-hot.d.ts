declare module "rollup-plugin-hot" {
  import { Plugin } from "rollup";

  interface RollupHmrOptions {
    enabled?: boolean;
    hot?: boolean;
    public?: string;
    baseUrl?: string;
    inMemory?: boolean;
    clearConsole?: boolean;
    cors?: boolean;
    port?: number;
    host?: string;
    randomPortFallback?: boolean;
    reload?: boolean;
    compatModuleHot?: boolean;
    rewriteModuleHot?: boolean;
    compatNollup?: boolean;
    open?: boolean;
    openHost?: string;
    openPort?: number;
    openPage?: string;
    autoAccept?: boolean;
    verbose?: boolean;
    loaderFile?: string;
    hotBundleSuffix?: string;
    publicHost?: string;
    publicPort?: number;
    useWebSocket?: boolean;
    proxy?: string;
    mount?: string;
    index?: string;
    fallback?: string;
    serve?: boolean;
    write?: boolean;
    inlineRuntime?: boolean;
  }

  /** Support hot module reloading */
  function hot(options?: RollupHmrOptions): Plugin;
  export default hot;
}
