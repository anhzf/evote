import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { defineOperation } from 'actions/define-operation';
import { Notify } from 'quasar';
import { getAuth, getFns } from 'src/firebase';
import { useI18n } from 'vue-i18n';

interface Payload {
  votingEventId: string;
  voteToken: string;
}

const operation = defineOperation<Payload, void>({
  name: 'auth:login_vote-token',
  handler: async (payload) => {
    const fns = getFns();
    const getCustomToken = httpsCallable<Payload, string>(fns, 'auth-loginWithVoteToken');
    const { data: customToken } = await getCustomToken(payload);

    await signInWithCustomToken(getAuth(), customToken);
    const { t } = useI18n();

    return void Notify.create({
      type: 'positive',
      message: t('Successfully logged in'),
    });
  },
});

export default operation;
