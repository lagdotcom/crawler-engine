type Disposable = { dispose(): void };

export default abstract class AbstractCache<T extends Disposable> {
  private cache: Record<string, T>;

  constructor() {
    this.cache = {};
  }

  clear(): void {
    Object.values(this.cache).forEach((g) => g.dispose());
    this.cache = {};
  }

  protected get(key: string, gen: () => T): T {
    if (!this.cache[key]) this.cache[key] = gen();
    return this.cache[key];
  }
}
