import { votableApi } from '@anhzf/evote-shared';
import { SessionPath } from '@anhzf/evote-shared/src/entity/session';
import { queryOptions, useQuery } from '@tanstack/vue-query';
import { useActiveSession } from '~/lib/queries/session';

export const useVotables = () => {
  const { data: session } = useQuery(useActiveSession());

  return queryOptions({
    queryKey: ['session', () => session.value?.id, 'votables'],
    queryFn: () => {
      return votableApi.all($glob('sessPath', SessionPath.fills({ session: session.value!.id })));
    },
    enabled: () => !!session.value,
  });
};
