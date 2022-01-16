import { initializeApp } from 'firebase/app';
import { getAuth as fbGetAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import config from 'src/config';

const firebaseApp = initializeApp(config.firebase.config);

let auth: Auth;
let db: Firestore;

const getDb = () => {
  if (!db) {
    db = initializeFirestore(firebaseApp, {
      ignoreUndefinedProperties: true,
    });

    if (config.firebase.useEmulator) {
      connectFirestoreEmulator(db, config.firebase.emulatorHost, config.firebase.emulatorPort.firestore);
    }
  }

  return db;
};

const getAuth = () => {
  if (!auth) {
    auth = fbGetAuth(firebaseApp);

    if (config.firebase.useEmulator) {
      connectAuthEmulator(auth, `http://${config.firebase.emulatorHost}:${config.firebase.emulatorPort.auth}`);
    }
  }

  return auth;
};

export {
  firebaseApp as default,
  getDb,
  getAuth,
};
