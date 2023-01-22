// type anyFn = (...args: unknown[]) => unknown;

// export const singleton = <T extends anyFn>(fn: T) => {
//   let instance: ReturnType<T>;

//   return (...args: unknown[]) => {
//     if (!instance) {
//       instance = fn(...args) as ReturnType<T>;
//     }

//     return instance;
//   };
// };

export const singleton = <R, A extends unknown[]>(fn: ((...args: A) => R)) => {
  let instance: R | null = null;
  return (...args: A) => {
    if (instance === null) {
      instance = fn(...args);
    }
    return instance;
  };
};
