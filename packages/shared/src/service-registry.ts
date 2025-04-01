import { nanoid } from 'nanoid';

export const createServiceRegistry = () => {
  const serviceMap = new Map<string, any>();
  const registerMap = new Map<string, any>();

  const get = <S>(key: string): S => {
    if (serviceMap.has(key)) return serviceMap.get(key);

    const registerFn = registerMap.get(key);
    if (!registerFn) throw new Error(`Service ${key} not found`);

    const service = registerFn();
    serviceMap.set(key, service);

    return service;
  };

  const register = Object.assign(<S>(registerFn: () => S) => {
    const key = nanoid();

    registerMap.set(key, registerFn);

    return () => get<S>(key);
  }, {
    named: <S>(key: string, registerFn: () => S) => {
      registerMap.set(key, registerFn);
      return () => get<S>(key);
    },
  });

  return {
    register,
    get,
  };
};
