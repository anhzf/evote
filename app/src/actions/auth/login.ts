import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { defineOperation } from 'actions/define-operation';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const operation = defineOperation<never, void>({
  name: 'auth:login',
  handler: (() => {
    const provider = new GoogleAuthProvider();
    return () => signInWithPopup(getAuth(), provider)
      .then(() => {
        const { t } = useI18n();
        return void Notify.create({
          type: 'positive',
          message: t('Successfully logged in'),
        });
      });
  })(),
});

export default operation;
