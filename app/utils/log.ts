export const $glob = <T>(key: string, data: T): T => {
  if (import.meta.dev) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)[`$${key}`] = data;
    console.debug(`$glob: ${key}`, data);
  }

  return data;
};
