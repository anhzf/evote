import type { FirebaseOptions } from 'firebase/app';
import firebaseJson from '~/firebase.json';

export default Object.freeze({
  publicUrl: process.env.PUBLIC_URL || window.location.origin,
  firebase: {
    config: process.env.FIREBASE_CONFIG as FirebaseOptions,
    useEmulator: process.env.FIREBASE_EMULATOR,
    // useEmulator: true,
    emulatorHost: 'localhost',
    emulatorPort: {
      firestore: firebaseJson.emulators.firestore.port,
      auth: firebaseJson.emulators.auth.port,
      functions: firebaseJson.emulators.functions.port,
      storage: firebaseJson.emulators.storage.port,
    },
  },
});
