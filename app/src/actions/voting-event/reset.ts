import { defineOperation } from 'actions/define-operation';
import { httpsCallable } from 'firebase/functions';
import { getFns } from 'src/firebase';

const CALLABLE_NAME = 'votingEvent-reset';

const operation = defineOperation<string>({
  name: 'voting-event:reset',
  handler: async (votingEventId) => {
    const fn = httpsCallable<string, void>(getFns(), CALLABLE_NAME);
    await fn(votingEventId);
  },
});

export default operation;
