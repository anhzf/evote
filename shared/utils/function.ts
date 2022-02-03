/* create singleton function */
export const singleton = <R, A extends unknown[]>(fn: ((...args: A) => R)) => {
  let instance: R | null = null;
  return (...args: A) => {
    if (instance === null) {
      instance = fn(...args);
    }
    return instance;
  };
};

