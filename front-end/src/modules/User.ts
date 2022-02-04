import {
  doc, getDoc, QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getAuth, getDb } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import { IUserData, UserData } from '~/shared/core';
import { collectionName } from '~/shared/firestoreReferences';

export const UserDataConverter = {
  toEntity: (snapshot: QueryDocumentSnapshot<IUserData>) => {
    const base = BaseEntityConverter.fillEntity(snapshot);

    return new UserData().fill({
      ...base,
      relatedVotingEvents: base.relatedVotingEvents || [],
    });
  },
  toDoc: (entity: UserData) => ({
    ...entity.toObj(true),
    // expecting the string is fullpath to reference
    relatedVotingEvents: entity.relatedVotingEvents.map((id) => doc(getDb(), id)),
  }),
};

export const getCurrentUserData = async () => {
  const db = getDb();
  const auth = getAuth();

  if (auth.currentUser) {
    const docRef = doc(db, `${collectionName.UserData}/${auth.currentUser.uid}`);
    // prefer error caused by undefined userData than unreal data
    const snapshot = await getDoc(docRef) as QueryDocumentSnapshot<IUserData>;

    return UserDataConverter.toEntity(snapshot);
  }

  throw new Error('UNAUTHENTICATED');
};
