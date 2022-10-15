type anyFn = (...args: unknown[]) => unknown;

export const singleton = <T extends anyFn>(fn: T) => {
  let instance: ReturnType<T>;

  return (...args: unknown[]) => {
    if (!instance) {
      instance = fn(...args) as ReturnType<T>;
    }

    return instance;
  };
};
