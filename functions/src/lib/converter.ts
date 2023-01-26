import {VoteToken} from '@anhzf/evote-shared/models';
import {Timestamp} from 'firebase-admin/firestore';
import {getDb} from '../utils/firebase';
import * as fromSrc from './models';

export const voteTokenConverter = {
  toSrc: (data: VoteToken) => ({
    voter: getDb().doc(data.voter),
    points: data.points,
    voted: data.voted ?
      getDb().doc(data.voted) :
      undefined,
    meta: data.meta,
    createdAt: Timestamp.fromDate(data.createdAt),
    updatedAt: data.updatedAt && Timestamp.fromDate(data.updatedAt),
    deletedAt: data.deletedAt && Timestamp.fromDate(data.deletedAt),
  } as fromSrc.VoteToken),
  fromSrc: (data: fromSrc.VoteToken): VoteToken => ({
    uid: data.uid,
    voter: data.voter.path,
    voted: data.voted?.path,
    points: data.points,
    meta: data.meta,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    deletedAt: data.deletedAt?.toDate(),
  } as VoteToken),
};
