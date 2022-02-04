import {
  collection, CollectionReference, doc, DocumentReference, getDoc, getDocs, limit, onSnapshot, query, QueryDocumentSnapshot, where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref } from 'firebase/storage';
import { getDb, getFns, getStorage } from 'src/firebase';
import { BaseEntityConverter, save } from 'src/modules/BaseEntity';
import { getDocsByPaths } from 'src/modules/common';
import {
  IVoteObject, IVotingEvent, VoteObject, VotingEvent,
} from '~/shared/core';
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

export const createVotingEvent = async (votingEvent: VotingEvent) => {
  const db = getDb();
  const isUrlExists = !!(votingEvent.url && await getVotingEventByUrl(votingEvent.url));

  if (isUrlExists) {
    throw new Error('VOTING_EVENT_WITH_SAME_URL_EXISTS');
  }

  const collectionRef = collection(db, cn.VotingEvent) as CollectionReference<IVotingEvent>;
  return save(votingEvent.toObj(), collectionRef);
};

interface IVotingEventSummary {
  used: number;
  total: number;
  // k is VoteObject.id
  [k: string]: number;
}

export const getVoteObjects = async (votingEventId: string, ...ids: string[]) => {
  const paths = ids.map((id) => `${cn.VotingEvent}/${votingEventId}/${cn.VoteObject}/${id}`);
  const docs = await getDocsByPaths(...paths);
  return docs.map((el, i) => new VoteObject().fill({
    ...el as IVoteObject,
    id: ids[i],
  }));
};

export const getVotingEventSummary = async (votingEventId: string) => {
  const db = getDb();
  const summaryRef = doc(db, `${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.summary}`);
  const summarySnapshot = await getDoc(summaryRef) as QueryDocumentSnapshot<IVotingEventSummary>;
  const { used, total, ...summary } = summarySnapshot.data();
  // get the VoteObject details info
  const ids = Object.keys(summary);
  const data = await getVoteObjects(votingEventId, ...ids);
  const voteObjects = data.map((el) => ({
    voteObject: el,
    count: summary[el.id],
  }));

  return { used, total, voteObjects };
};

type VotingEventSummaryListener = (data: {
  used: number;
  total: number;
  voteObjects: {
    voteObject: VoteObject;
    count: number;
  }[];
}) => void;

export const listenVotingEventSummary = (
  votingEventId: string,
  listener: VotingEventSummaryListener,
  onError?: (reason: unknown) => void,
) => {
  const db = getDb();
  const summaryRef = doc(db, `${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.summary}`) as DocumentReference<IVotingEventSummary>;

  return onSnapshot(summaryRef, (snapshot) => {
    if (snapshot.exists()) {
      const { used, total, ...summary } = snapshot.data();
      const voteObjectIds = Object.keys(summary);

      getVoteObjects(votingEventId, ...voteObjectIds)
        .then((data) => listener({
          used,
          total,
          voteObjects: data.map((el) => ({
            voteObject: el,
            count: summary[el.id],
          })),
        }))
        .catch((err) => onError?.(err));
    }
  });
};

export const validateVotingEventResult = httpsCallable<{ votingEventId: string }, void>(getFns(), 'validateVoteResult');
