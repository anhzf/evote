import * as functions from "firebase-functions";
import {VoteToken} from "@anhzf/evote-shared/models";
import {getAuth, getDb} from "./utils/firebase";

export const loginWithVoteToken = functions.https.onCall(async (data) => {
  const {votingEventId, voteToken} = data;

  if (!votingEventId || !voteToken) {
    throw new functions.https.HttpsError("invalid-argument", "votingEventId and voteTokenId are required");
  }

  const docRef = getDb().doc(`VotingEvent/${votingEventId}/VotingToken/${voteToken}`);
  const snapshot = await docRef.get() as FirebaseFirestore.DocumentSnapshot<VoteToken>;
  const docData = snapshot.data();

  if (snapshot.exists && !docData?.deletedAt) {
    const claims = {
      scope: votingEventId,
    };

    return getAuth().createCustomToken(`VotingEvent/${votingEventId}/VoteToken/${voteToken}`, claims);
  }

  throw new functions.https.HttpsError("unauthenticated", "Invalid vote token");
});
