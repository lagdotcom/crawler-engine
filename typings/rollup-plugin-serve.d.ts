declare module "rollup-plugin-serve" {
  import { Plugin } from "rollup";

  interface ServeOptionsHttps {
    key?: string | Buffer | Buffer[];
    cert?: string | Buffer | Array<string | Buffer>;
    ca?: string | Buffer | Array<string | Buffer>;
  }

  interface ServeOptions {
    open?: boolean;
    openPage?: string;
    verbose?: boolean;
    contentBase?: string | string[];
    historyApiFallback?: string | boolean;
    host?: string;
    port?: number;
    onListening?(): void;
    https?: ServeOptionsHttps | false;
    headers?: Record<string, string>;
  }

  function serve(options?: ServeOptions): Plugin;
  export default serve;
}
