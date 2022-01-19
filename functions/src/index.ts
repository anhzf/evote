import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {FieldPath, getFirestore} from "firebase-admin/firestore";
import {collectionName} from "../../shared/firestoreReferences";
import {IVotingEvent, UserData, VotingEvent} from "@evote/core/dist/cjs";
import {FieldPath, FieldValue, getFirestore} from "firebase-admin/firestore";
import {collectionName as cn, votingEventInfoKey} from "../../shared/firestoreReferences";
import {IVoteToken, IVotingEvent, UserData, VoteToken, VotingEvent} from "@evote/core/dist/cjs";

initializeApp();

const db = getFirestore();
db.settings({
  ignoreUndefinedProperties: true,
});

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const docRef = db.doc(`${cn.UserData}/${user.uid}`);

  await docRef.set({
    createdAt: new Date(),
  });
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const docRef = db.doc(`${cn.UserData}/${user.uid}`);

  await docRef.delete();
});

export const onVotingEventWriteVoter = functions.firestore
    .document(`${cn.VotingEvent}/{votingEventId}/${cn.Voter}/{voterId}`)
    .onWrite(async (change, context) => {
      const votingEventId = context.params.votingEventId;
      const votingEventInfoVoterCacheDocRef = db.doc(`${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.voterMeta}`);

      if (!change.before.exists) {
        // New document Created : add one to count
        votingEventInfoVoterCacheDocRef.update({count: FieldValue.increment(1)});
      } else if (change.before.exists && change.after.exists) {
        // Updating existing document : Do nothing
      } else if (!change.after.exists) {
        // Deleting document : subtract one from count
        votingEventInfoVoterCacheDocRef.update({count: FieldValue.increment(-1)});
      }
    });

export const getUserVotingEvents = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const snapshot = await db.doc(`${cn.UserData}/${context.auth.uid}`).get();
  const userData = new UserData().fill({...snapshot.data(), id: snapshot.id});

  const votingEventsRef = db.collection(cn.VotingEvent);

  if (userData.relatedVotingEvents.length > 0) {
    const q = votingEventsRef.where(FieldPath.documentId(), "in", userData.relatedVotingEvents);
    const userVotingEvents = await q.get() as FirebaseFirestore.QuerySnapshot<IVotingEvent>;

    return userVotingEvents.docs
        .map((doc) => new VotingEvent()
            .fill({...doc.data(), id: doc.id}).toObj());
  }

  return [];
});

export const getVoteToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const {votingEventId, voterId} = data;

  if (!votingEventId || !voterId) {
    throw new functions.https.HttpsError("invalid-argument", "votingEventId and voterId are required");
  }

  const collectionRef = db.collection(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}`);
  const voterRef = db.doc(`${cn.VotingEvent}/${votingEventId}/${cn.Voter}/${voterId}`);
  const q = collectionRef
      .where("voter", "==", voterRef)
      .where("voted", "==", null)
      .limit(1);
  const {docs: [picked]} = await q.get() as FirebaseFirestore.QuerySnapshot<IVoteToken>;

  if (picked) {
    return new VoteToken().fill({...picked.data(), id: picked.id}).toObj();
  }

  // create the new ones
  const newDocRef = collectionRef.doc();
  const voteToken = new VoteToken().fill({id: newDocRef.id, voter: voterId});
  const {id, ...tokenData} = voteToken.toObj();

  await newDocRef.set({...tokenData, voter: voterRef});

  return voteToken.toObj();
});

