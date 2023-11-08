import {https} from 'firebase-functions/v2';
import {dbRef} from './utils/firestore';
import {getDb} from './utils/firebase';

export const reset = https.onCall<string>({
  maxInstances: 1,
}, async (req) => {
  const voteTokensColl = dbRef.voteTokens(req.data);
  return getDb().recursiveDelete(voteTokensColl);
});
