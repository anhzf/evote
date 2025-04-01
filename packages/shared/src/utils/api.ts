import { isServer } from '../setup';

/**
 * Ensure the called API is a server function.
 * This is a utility function that wraps a server function and ensures that it is called in the correct context.
 */
export const shouldOnServer = <T extends (...args: any[]) => any>(fn: T) => {
  return (...args: Parameters<T>) => {
    if (!isServer()) {
      throw new Error('This function should be called on the server');
    }

    const result = fn(...args);
    if (result instanceof Promise) {
      return result.then((res) => res);
    }
    return result;
  };
};
