import { QueryClient } from '@tanstack/vue-query';
import { serviceRegistry } from '~/lib/services/registry';

export const getQueryClient = serviceRegistry.register(() => new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      throwOnError: import.meta.dev,
    },
  },
}));
