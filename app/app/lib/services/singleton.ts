import { serviceRegistry } from '@anhzf/evote-shared';
import { DocPath } from '@anhzf/evote-shared/src/doc';
import { QueryClient } from '@tanstack/vue-query';
import SuperJSON, { deserialize, serialize } from 'superjson';

SuperJSON.registerClass(DocPath);

export const getQueryClient = serviceRegistry.register('queryClient', () => new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      throwOnError: import.meta.dev,
    },
    hydrate: {
      deserializeData: deserialize,
    },
    dehydrate: {
      serializeData: serialize,
    },
  },
}));
