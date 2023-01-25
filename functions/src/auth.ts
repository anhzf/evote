import * as functions from 'firebase-functions';
import {dbRef} from './utils/firestore';
import {getAuth} from './utils/firebase';

export const loginWithVoteToken = functions.https.onCall(async (data) => {
  const {votingEventId, voteToken} = data;

  if (!votingEventId || !voteToken) {
    throw new functions.https.HttpsError('invalid-argument', 'votingEventId and voteTokenId are required');
  }

  const docRef = dbRef.voteTokens(votingEventId).doc(voteToken);
  const snapshot = await docRef.get();
  const docData = snapshot.data();

  if (snapshot.exists && !docData?.deletedAt) {
    const claims = {
      scope: votingEventId,
    };

    return getAuth().createCustomToken(docRef.path, claims);
  }

  throw new functions.https.HttpsError('unauthenticated', 'Invalid vote token');
});
