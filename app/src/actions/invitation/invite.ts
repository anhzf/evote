import { defineOperation } from 'actions/define-operation';
import { addDoc, collection } from 'firebase/firestore';
import { getDb } from 'src/firebase';

const ROLE_NAME = 'admin';
const EXPIRES_IN_MS = 7 * 24 * 3600_000; // 30 days

interface Payload {
  votingEventId: string;
  email: string;
}

const operation = defineOperation<Payload, void>({
  name: 'invitation:invite',
  handler: async ({ votingEventId, email }) => {
    const coll = collection(getDb(), 'VotingEvent', votingEventId, 'Invitation');

    await addDoc(coll, {
      acceptedAt: null,
      email,
      expiredAt: new Date(Date.now() + EXPIRES_IN_MS),
      role: ROLE_NAME,
    });
  },
});

export default operation;
