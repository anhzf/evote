import {
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getAuth, getDb, getFns } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';
import {
  IVoteObject, IVoter, IVoteToken, VoteToken,
} from '~/shared/core';

export const VoteTokenConverter = {
  toEntity(snapshot: QueryDocumentSnapshot<IVoteToken>): VoteToken {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new VoteToken().fill({
      ...base,
      voted: (base.voted as unknown as DocumentReference<IVoteObject> | undefined)?.id,
      voter: (base.voter as unknown as DocumentSnapshot<IVoter>).id,
    });
  },
};

export const getVoteToken = async (votingEventId: string, voterId: string) => {
  const fns = getFns();
  const getter = httpsCallable<{votingEventId: string; voterId: string;}, IVoteToken>(fns, 'getVoteToken');
  const result = await getter({ votingEventId, voterId });

  return new VoteToken().fill(result.data);
};

export const vote = async (votingEventId: string, voteToken: string, voted: string) => {
  const fns = getFns();
  const action = httpsCallable<{votingEventId: string; voteToken: string; vote: string;}, void>(fns, 'vote');

  return action({ votingEventId, voteToken, vote: voted });
};

export const getUserVoteToken = async () => {
  const auth = getAuth();
  const db = getDb();

  if (auth.currentUser) {
    const { uid } = auth.currentUser;
    const docRef = doc(db, uid);
    const snapshot = await getDoc(docRef) as DocumentSnapshot<IVoteToken>;

    if (snapshot.exists()) {
      return VoteTokenConverter.toEntity(snapshot);
    }

    return undefined;
  }

  throw new Error('UNAUTHENTICATED!');
};
