import { defineOperation } from 'actions/define-operation';
import { VoteToken } from '@anhzf/evote-shared/models';
import { httpsCallable } from 'firebase/functions';
import { getFns } from 'src/firebase';

interface Payload {
  votingEventId: string;
}

interface Result {
  created: number;
  existing: number;
  expired: number;
  total: number;
  tokens: {
    created: VoteToken[];
    existing: VoteToken[];
  };
}

export default defineOperation<Payload, Result>({
  name: 'vote-token:generate-all',
  handler: async (payload) => {
    const fn = httpsCallable<Payload, Result>(getFns(), 'voteToken-generateAll');
    const { data } = await fn(payload);
    return {
      ...data,
      tokens: {
        created: data.tokens.created.map((token) => ({
          ...token,
          createdAt: new Date(token.createdAt),
          updatedAt: token.updatedAt ? new Date(token.updatedAt) : undefined,
          deletedAt: token.deletedAt ? new Date(token.deletedAt) : undefined,
        })),
        existing: data.tokens.existing.map((token) => ({
          ...token,
          createdAt: new Date(token.createdAt),
          updatedAt: token.updatedAt ? new Date(token.updatedAt) : undefined,
          deletedAt: token.deletedAt ? new Date(token.deletedAt) : undefined,
        })),
      },
    };
  },
});
