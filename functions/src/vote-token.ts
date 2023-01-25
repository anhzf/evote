import {VoteToken, voteTokenOperations} from '@anhzf/evote-shared/models';
import {QueryDocumentSnapshot, Timestamp} from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import {VOTE_TOKEN_EXPIRATION} from './lib/constants';
import * as fromSrc from './lib/models';
import {getDb} from './utils/firebase';
import {dbRef} from './utils/firestore';

export const get = functions.https.onCall(async (data, context) => {
  // TODO: Check if user is admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not authenticated');
  }

  const {votingEventId, voterId} = data;

  if (!votingEventId || !voterId) {
    throw new functions.https.HttpsError('invalid-argument', 'votingEventId and voterId are required');
  }

  return getDb().runTransaction<VoteToken>(async (t) => {
    const collectionRef = dbRef.voteTokens(votingEventId);
    const voterRef = dbRef.voters(votingEventId).doc(voterId);

    const query = collectionRef.where('voter', '==', voterRef);
    const snapshots = await t.get(query);

    interface TokenGroups {
      available: QueryDocumentSnapshot<fromSrc.VoteToken>[];
      expired: QueryDocumentSnapshot<fromSrc.VoteToken>[];
    }

    // Group tokens by availability
    const tokens = snapshots.docs.reduce<TokenGroups>((acc, doc) => {
      const data = doc.data();
      const expiredAt = data.createdAt.toMillis() + VOTE_TOKEN_EXPIRATION * 1000;

      if (expiredAt > Timestamp.now().toMillis()) {
        acc.available.push(doc);
      } else {
        acc.expired.push(doc);
      }

      return acc;
    }, {available: [], expired: []});

    // Delete vote tokens if expired
    tokens.expired.forEach((doc) => t.delete(doc.ref, {exists: true}));

    // Create new vote token if there is no available token
    if (tokens.available.length === 0) {
      const voteToken: VoteToken = voteTokenOperations.create({
        voter: voterRef.path,
      });
      const voteTokenSrc = <fromSrc.VoteToken>{
        voter: voterRef,
        points: voteToken.points,
        voted: voteToken.voted ? dbRef.votables(votingEventId).doc(voteToken.voted) : undefined,
        meta: voteToken.meta,
        createdAt: Timestamp.fromDate(voteToken.createdAt),
        updatedAt: voteToken.updatedAt && Timestamp.fromDate(voteToken.updatedAt),
        deletedAt: voteToken.deletedAt && Timestamp.fromDate(voteToken.deletedAt),
      };

      t.create(collectionRef.doc(voteToken.uid), voteTokenSrc);

      return voteToken;
    }

    // Return the first available vote token
    const [picked] = tokens.available;
    const data = picked.data();
    return {
      uid: picked.id,
      voter: data.voter.path,
      voted: data.voted?.path,
      points: data.points,
      meta: data.meta,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      deletedAt: data.deletedAt?.toDate(),
    };
  });
});
