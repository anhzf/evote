import {VoteToken} from '@anhzf/evote-shared/models';
import {QueryDocumentSnapshot, Timestamp} from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import * as fromSrc from './lib/models';
import {
  createVoteToken,
  groupTokensByStatus,
  groupTokensByVoter,
  sourceToVoteToken,
  validateVotingEvent,
} from './lib/vote-token-utils';
import {getDb} from './utils/firebase';
import {dbRef} from './utils/firestore';

/**
 * Generate vote tokens for all voters in a voting event
 */
export const generateAll = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User is not authenticated');
  }

  const {votingEventId} = data;

  if (!votingEventId) {
    throw new functions.https.HttpsError('invalid-argument', 'votingEventId is required');
  }

  return getDb().runTransaction(async (t) => {
    // Validate voting event and get policies
    const {noTokenExpiration} = await validateVotingEvent(votingEventId);

    // Fetch all voters and tokens in parallel
    const votersRef = dbRef.voters(votingEventId);
    const tokensRef = dbRef.voteTokens(votingEventId);

    const [votersSnapshot, tokensSnapshot] = await Promise.all([
      t.get(votersRef),
      t.get(tokensRef),
    ]);

    // Group existing tokens by voter
    const tokensByVoter = groupTokensByVoter(
        tokensSnapshot.docs as QueryDocumentSnapshot<fromSrc.VoteToken>[],
        noTokenExpiration,
    );

    // Track what we're creating
    const created: VoteToken[] = [];
    const existing: VoteToken[] = [];
    let expiredCount = 0;

    // Process each voter
    for (const voterDoc of votersSnapshot.docs) {
      const voterRef = voterDoc.ref as typeof voterDoc.ref & {path: string};
      const voterTokens = tokensByVoter[voterRef.path];

      // Delete expired tokens
      if (voterTokens?.expired.length > 0) {
        voterTokens.expired.forEach((doc) => t.delete(doc.ref));
        expiredCount += voterTokens.expired.length;
      }

      // If voter has a used token, track it
      if (voterTokens?.used.length > 0) {
        const [usedToken] = voterTokens.used;
        existing.push(sourceToVoteToken(usedToken));
        continue;
      }

      // If voter has an available token, track it
      if (voterTokens?.available.length > 0) {
        const [availableToken] = voterTokens.available;
        existing.push(sourceToVoteToken(availableToken));
        continue;
      }

      // Create new token for voter
      const {token, src} = createVoteToken(voterRef);
      t.create(tokensRef.doc(token.uid), src);
      created.push(token);
    }

    return {
      created: created.length,
      existing: existing.length,
      expired: expiredCount,
      total: votersSnapshot.size,
      tokens: {
        created: created.map((token) => ({
          ...token,
          createdAt: token.createdAt.toISOString(),
          updatedAt: token.updatedAt?.toISOString(),
          deletedAt: token.deletedAt?.toISOString(),
        })),
        existing: existing.map((token) => ({
          ...token,
          createdAt: token.createdAt.toISOString(),
          updatedAt: token.updatedAt?.toISOString(),
          deletedAt: token.deletedAt?.toISOString(),
        })),
      },
    };
  });
});

/**
 * Generate new vote token for a specific voter
 *
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
    const votingEventRef = dbRef.votingEvents().doc(votingEventId);
    const voterRef = dbRef.voters(votingEventId).doc(voterId);

    // Validate voting event
    const votingEvent = await t.get(votingEventRef);
    if (!votingEvent.exists) {
      throw new functions.https.HttpsError('not-found', 'Voting event not found');
    }

    const noTokenExpiration = votingEvent.data()?.policies?.noTokenExpiration || false;

    // Get all tokens for this voter
    const query = collectionRef.where('voter', '==', voterRef);
    const snapshots = await t.get(query);

    // Group tokens by availability
    const tokens = groupTokensByStatus(
        snapshots.docs as QueryDocumentSnapshot<fromSrc.VoteToken>[],
        noTokenExpiration,
    );

    // Delete expired tokens
    tokens.expired.forEach((doc) => t.delete(doc.ref));

    // Return used vote token if there is any
    if (tokens.used.length > 0) {
      return sourceToVoteToken(tokens.used[0]);
    }

    // Create new vote token if there is no available token
    if (tokens.available.length === 0) {
      const {token, src} = createVoteToken(voterRef);
      t.create(collectionRef.doc(token.uid), src);
      return token;
    }

    // Return the first available vote token
    return sourceToVoteToken(tokens.available[0]);
  });
});

export const use = functions.https.onCall(async ({id: votableId}, context) => {
  // Validate arguments
  if (!votableId) {
    throw new functions.https.HttpsError('invalid-argument', 'ID is required');
  }

  const voteTokenRefRegex = new RegExp(dbRef.voteTokens('(.+)').doc('(.+)').path);

  // Get voting event id and vote token id from authenticated token
  const [, votingEventId, voteTokenId] = context.auth?.token.uid.match(voteTokenRefRegex) || [];

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

  await Promise.all([
    voteTokenRef.update({
      voted: dbRef.votables(votingEventId).doc(votableId),
      votedAt: Timestamp.now(),
    }),
    voteToken?.voter.update({
      isVoted: true,
    }),
  ]);
});

// export const onChange = functions.firestore
//     .document(dbRef.voteTokens('{votingEventId}').doc('{voteTokenId}').path)
//     .onWrite(async (diff, context) => {
//       // const {votingEventId} = context.params;
//     });
