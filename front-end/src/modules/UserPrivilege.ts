import {
  doc, DocumentSnapshot, getDoc, QueryDocumentSnapshot,
} from 'firebase/firestore';
import { IUserPrivilege, UserPrivilege } from '@evote/core';
import { getAuth, getDb } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import { collectionName as c } from '~/shared/firestoreReferences';

export const UserPrivilegeConverter = {
  toEntity: (snapshot: QueryDocumentSnapshot<IUserPrivilege>) => {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new UserPrivilege().fill(base);
  },
  toDoc: (entity: UserPrivilege) => entity.toObj(true),
};

export const getUserPrivilege = async (votingEventId: string) => {
  const db = getDb();
  const auth = getAuth();

  if (auth.currentUser) {
    // FOR DEPLOYMENT REQUIREMENT, WILL BE FIXED SOON
    if (auth.currentUser.email?.match(/@\w+\.smp\.belajar\.id/g)) {
      return new UserPrivilege().fill({ role: 'ADMIN' });
    }
    // END OF DEPLOYMENT REQUIREMENT

    const docRef = doc(db, `${c.VotingEvent}/${votingEventId}/${c.UserPrivilege}/${auth.currentUser.uid}`);
    const snapshot = await getDoc(docRef) as DocumentSnapshot<IUserPrivilege>;

    return snapshot.exists()
      ? UserPrivilegeConverter.toEntity(snapshot)
      : new UserPrivilege();
  }

  throw new Error('UNAUTHENTICATED');
};
