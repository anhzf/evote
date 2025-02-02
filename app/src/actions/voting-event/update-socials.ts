import { defineOperation } from 'actions/define-operation';
import { doc, updateDoc } from 'firebase/firestore';
import { getDb } from 'src/firebase';

interface Payload {
  votingEventId: string;
  items: {
    type: string;
    url: string;
    label: string;
  }[];
}

const action = defineOperation<Payload, void>({
  name: 'voting-event:update-socials',
  handler: async ({ votingEventId, items }) => {
    const votingEventDoc = doc(getDb(), 'VotingEvent', votingEventId);

    await updateDoc(votingEventDoc, 'socials', items);
  },
});

export default action;
