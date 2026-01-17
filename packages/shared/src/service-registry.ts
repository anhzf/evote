export const createServiceRegistry = () => {
  const serviceMap = new Map<string, any>();
  const registerMap = new Map<string, any>();

  const get = <S>(key: string, defaultValue?: () => S): S => {
    if (serviceMap.has(key)) return serviceMap.get(key);

    const registerFn = registerMap.get(key);
    if (!registerFn) {
      if (defaultValue !== undefined) {
        console.warn(`Service ${key} not found, using default value`);
        return defaultValue();
      }

      throw new Error(`Service ${key} not found`);
    }

    const service = registerFn();
    serviceMap.set(key, service);

    return service;
  };

  function register<S>(registerFn: () => S): () => S;
  function register<S>(key: string, registerFn: () => S): () => S;
  function register<S>(arg1: string | (() => S), arg2?: () => S): () => S {
    const registerFn = typeof arg1 === 'string' ? arg2! : arg1;
    const key = typeof arg1 === 'string' ? arg1 : registerFn.name;

    if (!key) {
      throw new Error('Service key is required. If you are using an anonymous function, please provide a key as the first argument. Or define your function with a named function.');
    }

    if (registerMap.has(key)) {
      console.warn(`Service ${key} is already registered. This service will use previous registration.`);
      return () => get<S>(key);
    }

    registerMap.set(key, registerFn);

    return () => get<S>(key);
  }

  // Vite specific handler
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      console.log('Clearing service registry due to HMR');

      serviceMap.clear();
      registerMap.clear();
    });
  }

  return {
    register,
    get,
    listServices: () => Array.from(registerMap.keys()),
  };
};
