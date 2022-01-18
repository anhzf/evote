import type { FirebaseOptions } from 'firebase/app';
import firebaseJson from '~/firebase.json';

export default {
  firebase: {
    config: JSON.parse(process.env.FIREBASE_CONFIG) as FirebaseOptions,
    useEmulator: process.env.DEV,
    emulatorHost: 'localhost',
    emulatorPort: {
      firestore: firebaseJson.emulators.firestore.port,
      auth: firebaseJson.emulators.auth.port,
      functions: firebaseJson.emulators.functions.port,
      storage: firebaseJson.emulators.storage.port,
    },
  },
};
