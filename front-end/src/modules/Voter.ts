import {
  collection, CollectionReference, doc, getDoc, query, QueryDocumentSnapshot, startAt, writeBatch, orderBy, where, limit, getDocs, QuerySnapshot,
} from 'firebase/firestore';
import { Voter } from '@evote/core';
import { getAuth, getDb } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import { collectionName as c, votingEventInfoKey } from '~/shared/firestoreReferences';
import { arrayChunks } from '~/shared/utils/array';

const FIREBASE_WRITE_LIMIT = 500;

export const VoterConverter = {
  toEntity(snapshot: QueryDocumentSnapshot<Voter>): Voter {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new Voter().fill(base);
  },
  toDocReady(voter: Voter) {
    const { id, ...data } = voter.toObj(true);
    return { id, data };
  },
};

export const saveVoterBatch = (votingEventId: string, voter: Voter[]) => {
  const db = getDb();
  const chunks = arrayChunks(voter, FIREBASE_WRITE_LIMIT);
  const voterCollectionRef = collection(db, `${c.VotingEvent}/${votingEventId}/${c.Voter}`) as CollectionReference<Voter>;

  return Promise.all(chunks.map((chunk) => {
    const batch = writeBatch(db);

    chunk.forEach((v) => {
      const { id, data } = VoterConverter.toDocReady(v);
      const docRef = id ? doc(voterCollectionRef, id) : doc(voterCollectionRef);
      batch.set(docRef, data);
    });

    return batch.commit();
  }));
};

export const getVoterListCount = async (votingEventId: string) => {
  const db = getDb();
  const voterMetaRef = doc(db, `${c.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.voterMeta}`);
  const voterMeta = await getDoc(voterMetaRef);

  return Number(voterMeta.data()?.count || 0);
};

export const fetchVoterList = async (votingEventId: string, start = 0, offset = 0, filter = '', sortBy = 'meta.NAMA', isDesc = false) => {
  const db = getDb();
  const voterCollectionRef = collection(db, `${c.VotingEvent}/${votingEventId}/${c.Voter}`);

  if (filter) {
    const q = query(voterCollectionRef,
      where(sortBy, '==', filter),
      orderBy(sortBy, isDesc ? 'desc' : 'asc'),
      startAt(start),
      limit(offset > 0 ? offset : Infinity));
    const voters = await getDocs(q) as QuerySnapshot<Voter>;

    return voters.docs.map((el) => VoterConverter.toEntity(el));
  }

  return [];
};

// export const getUserVoterAccount =async (votingEventId:string) => {
//   const auth = getAuth();
//   const db = getDb();

//   const voterCollectionRef = collection(db, `${c.VotingEvent}/${votingEventId}/${c.Voter}`);
//   const q = query(voterCollectionRef,
//     where('userId', '==', auth.currentUser?.email),
// }
