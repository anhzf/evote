import { initializeApp } from 'firebase/app';
import { getAnalytics as fbGetAnalytics } from 'firebase/analytics';
import { getAuth as fbGetAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage as fbGetStorage, connectStorageEmulator } from 'firebase/storage';
import config from 'src/config';
// import { singleton } from '~/shared/utils/function';

const singleton = <R, A extends unknown[]>(fn: ((...args: A) => R)) => {
  let instance: R | null = null;
  return (...args: A) => {
    if (instance === null) {
      instance = fn(...args);
    }
    return instance;
  };
};

const firebaseApp = initializeApp(config.firebase.config);

const STORAGE_BUCKET = config.firebase.useEmulator ? 'gs://default-bucket/' : config.firebase.config.storageBucket;

const getDb = singleton(() => {
  const db = initializeFirestore(firebaseApp, {
    ignoreUndefinedProperties: true,
  });

  if (config.firebase.useEmulator) {
    connectFirestoreEmulator(db, config.firebase.emulatorHost, config.firebase.emulatorPort.firestore);
  }

  return db;
});

const getAuth = singleton(() => {
  const auth = fbGetAuth(firebaseApp);

  if (config.firebase.useEmulator) {
    connectAuthEmulator(auth, `http://${config.firebase.emulatorHost}:${config.firebase.emulatorPort.auth}`);
  }

  return auth;
});

const getFns = singleton(() => {
  const fns = getFunctions(firebaseApp);

  if (config.firebase.useEmulator) {
    connectFunctionsEmulator(fns, config.firebase.emulatorHost, config.firebase.emulatorPort.functions);
  }

  return fns;
});

const getStorage = singleton(() => {
  const storage = fbGetStorage(firebaseApp, STORAGE_BUCKET);

  if (config.firebase.useEmulator) {
    connectStorageEmulator(storage, config.firebase.emulatorHost, config.firebase.emulatorPort.storage);
  }

  return storage;
});

const getAnalytics = singleton(() => fbGetAnalytics());

export {
  firebaseApp as default,
  getDb,
  getAuth,
  getFns,
  getStorage,
  getAnalytics,
};
