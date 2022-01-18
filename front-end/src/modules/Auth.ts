import {
  createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut,
} from 'firebase/auth';
import { Notify } from 'quasar';
import { getAuth } from 'src/firebase';
import { useAuthStore } from 'src/store/useAuthStore';

const AUTH_CRED = {
  email: 'dev@example.test',
  pass: '123456',
};

export const useAuthModule = () => {
  const auth = getAuth();
  const { onAuthenticating } = useAuthStore();

  const login = () => onAuthenticating(() => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then(() => Notify.create({
        message: 'Berhasil masuk',
        color: 'positive',
      }))
      .catch((err) => {
        Notify.create({
          message: String(err),
          color: 'negative',
        });
      }) as Promise<void>;
  });

  const signUp = () => createUserWithEmailAndPassword(auth, AUTH_CRED.email, AUTH_CRED.pass);
  const logout = () => onAuthenticating(() => signOut(auth));

  return {
    login,
    logout,
    signUp,
  };
};
