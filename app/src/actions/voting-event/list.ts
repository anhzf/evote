import { defineOperation } from 'actions/define-operation';
import { VotingEvent } from '@anhzf/evote-shared/models';
import { httpsCallable } from 'firebase/functions';
import { getFns } from 'src/firebase';

const operation = defineOperation<never, VotingEvent[]>({
  name: 'voting-event:list',
  handler: async () => {
    const fn = httpsCallable<never, VotingEvent[]>(getFns(), 'getUserVotingEvents');
    const { data } = await fn();
    return data;
  },
});

export default operation;
