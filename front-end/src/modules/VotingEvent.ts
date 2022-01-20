import {
  collection, doc, DocumentData, getDoc, getDocs, limit, query, QueryDocumentSnapshot, where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref } from 'firebase/storage';
import { getDb, getFns, getStorage } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import {
  IVoteObject, IVotingEvent, VoteObject, VotingEvent,
} from '@evote/core';
import { collectionName as cn, votingEventInfoKey } from '~/shared/firestoreReferences';

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
  const collectionRef = collection(db, cn.VotingEvent);
  const q = query(collectionRef, where('url', '==', url), limit(1));
  const snapshot = await getDocs(q);
  const [picked] = snapshot.docs as QueryDocumentSnapshot<IVotingEvent>[];

  return picked?.exists()
    ? VotingEventConverter.toEntity(picked)
    : undefined;
};

export const getVotingEventImage = (votingEventId: string) => {
  const storage = getStorage();
  const imgRef = ref(storage, `${cn.VotingEvent}/${votingEventId}/MainBanner`);

  return getDownloadURL(imgRef);
};

interface IVotingEventSummary {
  used: number;
  total: number;
  // k is VoteObject.id
  [k: string]: number;
}

export const getVotingEventSummary = async (votingEventId: string) => {
  const db = getDb();
  const fns = getFns();
  const getDocsByPath = httpsCallable<{paths: string[]}, DocumentData[]>(fns, 'getDocumentsByFullPath');
  const summaryRef = doc(db, `${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.summary}`);
  const summarySnapshot = await getDoc(summaryRef) as QueryDocumentSnapshot<IVotingEventSummary>;
  const { used, total, ...summary } = summarySnapshot.data();
  const ids = Object.keys(summary);
  const paths = ids.map((k) => `${cn.VotingEvent}/${votingEventId}/${cn.VoteObject}/${k}`);
  const { data } = await getDocsByPath({ paths });
  const voteObjects = data.map((el, i) => {
    const voteObject = new VoteObject().fill({
      ...el as IVoteObject,
      id: ids[i],
    });

    return {
      voteObject,
      count: summary[voteObject.id],
    };
  });

  return {
    used,
    total,
    voteObjects,
  };
};

export const validateVotingEventResult = httpsCallable<{ votingEventId: string }, void>(getFns(), 'validateVoteResult');
