import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { defineOperation } from 'actions/define-operation';
import { Notify } from 'quasar';
import { getAuth, getFns } from 'src/firebase';

interface Payload {
  votingEventId: string;
  voteToken: string;
}

const operation = defineOperation<Payload, void>({
  name: 'auth:login_vote-token',
  handler: async (payload) => {
    const fn = httpsCallable<Payload, string>(getFns(), 'auth-signInWithVoteToken');
    const { data: customToken } = await fn(payload);

    await signInWithCustomToken(getAuth(), customToken);

    Notify.create({
      type: 'positive',
      message: 'Berhasil masuk!',
    });
  },
});

export default operation;
