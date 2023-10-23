export const get = <T extends Record<string, unknown>>(obj: T, path: string): any => {
  const pathArray = path.split('.');
  return pathArray.reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key];
    }
    return acc;
  }, obj as any);
};
