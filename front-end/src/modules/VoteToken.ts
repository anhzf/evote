import {
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { IVoteToken, VoteToken } from '@evote/core';
import { httpsCallable } from 'firebase/functions';
import { getFns } from 'src/firebase';
import { BaseEntityConverter } from 'src/modules/BaseEntity';

export const VoteTokenConverter = {
  toEntity(snapshot: QueryDocumentSnapshot<IVoteToken>): VoteToken {
    const base = BaseEntityConverter.fillEntity(snapshot);
    return new VoteToken().fill(base);
  },
};

export const getVoteToken = async (votingEventId: string, voterId: string) => {
  const fns = getFns();
  const getter = httpsCallable<{votingEventId: string; voterId: string;}, IVoteToken>(fns, 'getVoteToken');
  const result = await getter({ votingEventId, voterId });

  return new VoteToken().fill(result.data);
};
