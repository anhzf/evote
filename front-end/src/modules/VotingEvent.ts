import {
  collection, getDocs, limit, query, QueryDocumentSnapshot, where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDb, getFns } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import { IVotingEvent, VotingEvent } from '@evote/core';
import { collectionName } from '~/shared/firestoreReferences';

export const VotingEventConverter = {
  toEntity(snapshot: QueryDocumentSnapshot<IVotingEvent>): VotingEvent {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new VotingEvent().fill(base);
  },
};

export const getUserVotingEvents = async () => {
  const fn = httpsCallable<unknown, IVotingEvent[]>(getFns(), 'getUserVotingEvents');
  const { data } = await fn();

  return data.map((el) => new VotingEvent().fill(el));
};

export const getVotingEventByUrl = async (url: string) => {
  const db = getDb();
  const collectionRef = collection(db, collectionName.VotingEvent);
  const q = query(collectionRef, where('url', '==', url), limit(1));
  const snapshot = await getDocs(q);
  const [picked] = snapshot.docs as QueryDocumentSnapshot<IVotingEvent>[];

  return picked?.exists()
    ? VotingEventConverter.toEntity(picked)
    : undefined;
};
