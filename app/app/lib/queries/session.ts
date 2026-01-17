import { sessionApi } from '@anhzf/evote-shared';
import { queryOptions } from '@tanstack/vue-query';

export const useSessionByUrl = (url: string) => {
  return queryOptions({
    queryKey: ['session', url],
    queryFn: () => {
      return sessionApi.findByUrl(url);
    },
  });
};

export const useActiveSession = () => {
  const route = useRoute();
  return useSessionByUrl(String(route.params.session));
};

export const useSessions = () => {
  return queryOptions({
    queryKey: ['sessions'],
    queryFn: () => sessionApi.all(),
  });
};
