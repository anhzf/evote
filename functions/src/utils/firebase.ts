import {getApps, initializeApp} from 'firebase-admin/app';
import {getAuth as fbGetAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {singleton} from '@anhzf/evote-shared/utils';

if (getApps().length === 0) {
  initializeApp();
}

export const getAuth = singleton(() => fbGetAuth());

export const getDb = singleton(() => {
  const db = getFirestore();
  db.settings({
    ignoreUndefinedProperties: true,
  });
  return db;
});

