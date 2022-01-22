import { initializeApp } from 'firebase/app';
import { getAuth as fbGetAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage as fbGetStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import config from 'src/config';

const firebaseApp = initializeApp(config.firebase.config);

const STORAGE_BUCKET = config.firebase.useEmulator ? 'gs://default-bucket/' : config.firebase.config.storageBucket;

let auth: Auth;
let db: Firestore;
let fns: Functions;
let storage: FirebaseStorage;

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

const getFns = () => {
  if (!fns) {
    fns = getFunctions(firebaseApp);

    if (config.firebase.useEmulator) {
      connectFunctionsEmulator(fns, config.firebase.emulatorHost, config.firebase.emulatorPort.functions);
    }
  }

  return fns;
};

const getStorage = () => {
  if (!storage) {
    storage = fbGetStorage(firebaseApp, STORAGE_BUCKET);

    if (config.firebase.useEmulator) {
      connectStorageEmulator(storage, config.firebase.emulatorHost, config.firebase.emulatorPort.storage);
    }
  }

  return storage;
};

export {
  firebaseApp as default,
  getDb,
  getAuth,
  getFns,
  getStorage,
};
