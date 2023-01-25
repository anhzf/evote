import { defineOperation } from 'actions/define-operation';
import { VoteToken } from '@anhzf/evote-shared/models';
import { httpsCallable } from 'firebase/functions';
import { getFns } from 'src/firebase';

interface Payload {
  votingEventId: string;
  voterId: string;
}

const operation = defineOperation<Payload, VoteToken>({
  name: 'voting-event:list',
  handler: async (payload) => {
    const fn = httpsCallable<Payload, VoteToken>(getFns(), 'voteToken-get');
    const { data } = await fn(payload);
    return data;
  },
});

export default operation;
