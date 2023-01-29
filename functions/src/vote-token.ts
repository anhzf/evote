import {VoteToken, voteTokenOperations} from '@anhzf/evote-shared/models';
import {QueryDocumentSnapshot, Timestamp} from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import {VOTE_TOKEN_EXPIRATION} from './lib/constants';
import {voteTokenConverter} from './lib/converter';
import * as fromSrc from './lib/models';
import {getDb} from './utils/firebase';
import {dbRef} from './utils/firestore';

/**
 * TODO: Prevent same VoteToken
 */
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

    type TokenGroups = Record<'used'| 'available'| 'expired', QueryDocumentSnapshot<fromSrc.VoteToken>[]>

    // Group tokens by availability
    const tokens = snapshots.docs.reduce<TokenGroups>((acc, doc) => {
      const data = doc.data();

      if (data.voted) {
        acc.used.push(doc);
        return acc;
      }

      const expiredAt = data.createdAt.toMillis() + VOTE_TOKEN_EXPIRATION * 1000;

      if (expiredAt > Timestamp.now().toMillis()) {
        acc.available.push(doc);
      } else {
        acc.expired.push(doc);
      }

      return acc;
    }, {available: [], used: [], expired: []});

    // Delete vote tokens if expired
    tokens.expired.forEach((doc) => t.delete(doc.ref, {exists: true}));

    // Return used vote token if there is any
    if (tokens.used.length > 0) {
      const [used] = tokens.used;
      const data = used.data();
      return {
        ...voteTokenConverter.fromSrc(data),
        uid: used.id,
      };
    }

    // Create new vote token if there is no available token
    if (tokens.available.length === 0) {
      const voteToken: VoteToken = voteTokenOperations.create({
        voter: voterRef.path,
      });
      const voteTokenSrc = voteTokenConverter.toSrc(voteToken);

      t.create(collectionRef.doc(voteToken.uid), voteTokenSrc);

      return voteToken;
    }

    // Return the first available vote token
    const [picked] = tokens.available;
    const data = picked.data();
    return {
      ...voteTokenConverter.fromSrc(data),
      uid: picked.id,
    };
  });
});

export const use = functions.https.onCall(async ({id: votableId}, context) => {
  // Validate arguments
  if (!votableId) {
    throw new functions.https.HttpsError('invalid-argument', 'ID is required');
  }

  // Get voting event id and vote token id from authenticated token
  const [, votingEventId, voteTokenId] = context.auth?.token.uid.match(dbRef.voteTokens('(.+)').doc('(.+)').path) || [];

  // If not exist, throw error
  if (!votingEventId || !voteTokenId) {
    throw new functions.https.HttpsError('unauthenticated', 'Not allowed');
  }

  // Get vote token and check if it's existence
  const voteTokenRef = dbRef.voteTokens(votingEventId).doc(voteTokenId);
  const voteTokenSnapshot = await voteTokenRef.get();

  if (!voteTokenSnapshot.exists) {
    throw new functions.https.HttpsError('not-found', 'Vote token not found');
  }

  const voteToken = voteTokenSnapshot.data();

  // Check if vote token is already used
  if (voteToken?.voted) {
    throw new functions.https.HttpsError('already-exists', 'Vote token already used');
  }

  return void voteTokenRef.update({
    voted: dbRef.votables(votingEventId).doc(votableId),
    votedAt: Timestamp.now(),
  });
});

export const onChange = functions.firestore
    .document(dbRef.voteTokens('{votingEventId}').doc('{voteTokenId}').path)
    .onWrite(async (diff, context) => {
      // const {votingEventId} = context.params;
    });
