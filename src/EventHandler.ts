import EventEmitter from "eventemitter3";

import { EventMap, EventName } from "./Event";

type ListenerFn = <T extends EventName>(
  name: T,
  listener: (data: EventMap[T]) => void
) => void;

interface Events {
  emit<T extends EventName>(name: T, data: EventMap[T]): EventMap[T];
  off: ListenerFn;
  on: ListenerFn;
  once: ListenerFn;
  removeAllListeners(): void;
}

export default class EventHandler implements Events {
  private emitter: EventEmitter;
  emit: Events["emit"];
  off: Events["off"];
  on: Events["on"];
  once: Events["once"];
  removeAllListeners: () => void;

  constructor() {
    const emitter = new EventEmitter();

    this.emit = (name, data) => {
      emitter.emit(name, data);
      return data;
    };
    this.off = (name, listener) => emitter.off(name, listener);
    this.on = (name, listener) => emitter.on(name, listener);
    this.once = (name, listener) => emitter.once(name, listener);

    this.removeAllListeners = () => emitter.removeAllListeners();
    this.emitter = emitter;
  }
}
