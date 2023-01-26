import {FirebaseError} from 'firebase-admin';
import {UserRecord} from 'firebase-admin/auth';
import * as functions from 'firebase-functions';
import {getAuth} from './utils/firebase';
import {dbRef} from './utils/firestore';

export const signInWithVoteToken = functions.https.onCall(async (data) => {
  const {votingEventId, voteToken: token} = data;

  if (!votingEventId || !token) {
    throw new functions.https.HttpsError('invalid-argument', 'votingEventId and voteTokenId are required');
  }

  const voteTokenRef = dbRef.voteTokens(votingEventId).doc(token);
  const voteTokenSnapshot = await voteTokenRef.get();
  const voteToken = voteTokenSnapshot.data();

  if (voteTokenSnapshot.exists) {
    const auth = getAuth();
    const uid = voteTokenRef.path;
    let user: UserRecord;

    // Check if user exists
    try {
      user = await auth.getUser(uid);
    } catch (err) {
      if ((err as FirebaseError).code === 'auth/user-not-found') {
        // Create user and add a display name
        const voterSnapshot = await voteToken?.voter.get();
        const voter = voterSnapshot!.data()!;

        user = await auth.createUser({
          uid,
          displayName: voter.meta.NAMA,
        });
      } else throw err;
    }

    const claims = {
      scope: votingEventId,
    };

    return auth.createCustomToken(uid, claims);
  }

  throw new functions.https.HttpsError('unauthenticated', 'Invalid vote token');
});
