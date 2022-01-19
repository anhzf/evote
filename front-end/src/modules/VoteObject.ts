import {
  collection, getDocs, QueryDocumentSnapshot, QuerySnapshot,
} from 'firebase/firestore';
import { IVoteObject, VoteObject } from '@evote/core';
import { getDb, getStorage } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import { getDownloadURL, ref } from 'firebase/storage';
import { collectionName } from '~/shared/firestoreReferences';

export const VoteObjectConverter = {
  toEntity(snapshot: QueryDocumentSnapshot<IVoteObject>): VoteObject {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new VoteObject().fill(base);
  },
};

export const getVoteObjects = async (votingEventId: string) => {
  const db = getDb();
  const collectionRef = collection(db, `${collectionName.VotingEvent}/${votingEventId}/${collectionName.VoteObject}`);
  const { docs } = await getDocs(collectionRef) as QuerySnapshot<IVoteObject>;

  return docs.map((el) => VoteObjectConverter.toEntity(el));
};

export const getVoteObjectThumbnailUrl = async (votingEventId: string, voteObjectId: string) => {
  const storage = getStorage();
  const fileRef = ref(storage, `${collectionName.VotingEvent}/${votingEventId}/${collectionName.VoteObject}/${voteObjectId}.jpeg`);

  return getDownloadURL(fileRef);
};
