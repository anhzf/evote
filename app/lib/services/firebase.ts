import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth as $getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { serviceRegistry } from '~/lib/services/registry';

export const getFirebase = serviceRegistry.register(
  (): FirebaseApp => initializeApp(useRuntimeConfig().public.firebase.config)
);

export const getDb = serviceRegistry.register(
  (): Firestore => getFirestore(getFirebase(), 'evote')
);

export const getAuth = serviceRegistry.register((): Auth => {
  const auth = $getAuth(getFirebase());
  auth.tenantId = 'evote-q5wsx';
  return auth;
});
