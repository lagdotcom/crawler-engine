import Engine from "./Engine";

export default interface Component {
  attach(e: Engine): void;
  detach(e: Engine): void;
}
