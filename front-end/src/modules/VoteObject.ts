import {
  collection, getDocs, QueryDocumentSnapshot, QuerySnapshot,
} from 'firebase/firestore';
import { IVoteObject, VoteObject } from '@evote/core';
import { getDb, getStorage } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import { getDownloadURL, getBlob, ref } from 'firebase/storage';
import { collectionName as cn } from '~/shared/firestoreReferences';

export const VoteObjectConverter = {
  toEntity(snapshot: QueryDocumentSnapshot<IVoteObject>): VoteObject {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new VoteObject().fill(base);
  },
};

export const getVoteObjectThumbnailUrl = async (votingEventId: string, voteObjectId: string) => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, `${cn.VotingEvent}/${votingEventId}/${cn.VoteObject}/${voteObjectId}_img`);

    return getDownloadURL(fileRef);
  } catch (error) {
    return undefined;
  }
};

export const getVoteObjectDescUrl = async (votingEventId: string, voteObjectId: string) => {
  try {
    const storage = getStorage();
    const fileRef = ref(storage, `${cn.VotingEvent}/${votingEventId}/${cn.VoteObject}/${voteObjectId}_desc`);

    const blob = await getBlob(fileRef);
    return blob.text();
  } catch (error) {
    return '';
  }
};

export const getVoteObjects = async (votingEventId: string) => {
  const db = getDb();
  const collectionRef = collection(db, `${cn.VotingEvent}/${votingEventId}/${cn.VoteObject}`);
  const { docs } = await getDocs(collectionRef) as QuerySnapshot<IVoteObject>;

  return Promise.all(docs.map(async (el) => {
    const data = VoteObjectConverter.toEntity(el);
    return {
      data,
      img: (await getVoteObjectThumbnailUrl(votingEventId, el.id)) || `https://via.placeholder.com/200x200?text=${data.title}`,
    };
  }));
};
