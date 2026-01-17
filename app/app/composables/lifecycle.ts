import { syncRefs, useMounted } from '@vueuse/core';

export const isMounted = () => {
  const state = useState<boolean>(() => shallowRef(false));
  syncRefs(useMounted(), state);
  return state;
};
