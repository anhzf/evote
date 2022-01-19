import { Notify } from 'quasar';
import {
  GoogleAuthProvider, signInWithCustomToken, signInWithPopup, signOut,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { getAuth, getFns } from 'src/firebase';
import { useAuthStore } from 'src/store/useAuthStore';
import { promiseHandler } from 'src/utils/ui';

export const useAuthModule = () => {
  const auth = getAuth();
  const { onAuthenticating } = useAuthStore();

  const login = () => onAuthenticating(() => {
    const provider = new GoogleAuthProvider();

    return promiseHandler(
      signInWithPopup(auth, provider)
        .then(() => Notify.create({
          message: 'Berhasil masuk',
          color: 'positive',
        })),
    );
  });

  const loginWithVoteToken = (votingEventId: string, voteToken: string) => onAuthenticating(async () => {
    const fns = getFns();
    const getCustomToken = httpsCallable<{votingEventId: string; voteToken: string;}, string>(fns, 'loginWithVoteToken');
    const { data: customToken } = await getCustomToken({ votingEventId, voteToken });

    return promiseHandler(
      signInWithCustomToken(auth, customToken)
        .then(() => Notify.create({
          message: 'Berhasil masuk',
          color: 'positive',
        })),
    );
  });

  const logout = () => onAuthenticating(() => signOut(auth));

  return {
    login,
    loginWithVoteToken,
    logout,
  };
};
