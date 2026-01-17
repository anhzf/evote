import { serviceRegistry, setupFirestore } from '@anhzf/evote-shared';
import { initializeApp } from 'firebase/app';
import { getAuth as $getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const getFirebase = serviceRegistry.register(
  'firebaseApp',
  () => initializeApp(useRuntimeConfig().public.firebase.config)
);

export const getDb = setupFirestore(() => getFirestore(getFirebase(), 'evote'));

export const getAuth = serviceRegistry.register('firebaseAuth', () => {
  const auth = $getAuth(getFirebase());
  auth.tenantId = 'evote-q5wsx';
  return auth;
});
