import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {FieldPath, getFirestore} from "firebase-admin/firestore";
import {collectionName} from "../../shared/firestoreReferences";
import {IVotingEvent, UserData, VotingEvent} from "@evote/core/dist/cjs";

initializeApp();

const db = getFirestore();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const docRef = db.doc(`${collectionName.UserData}/${user.uid}`);

  await docRef.set({
    createdAt: new Date(),
  });
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const docRef = db.doc(`${collectionName.UserData}/${user.uid}`);

  await docRef.delete();
});

export const getUserVotingEvents = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const snapshot = await db.doc(`${collectionName.UserData}/${context.auth.uid}`).get();
  const userData = new UserData().fill({...snapshot.data(), id: snapshot.id});

  const votingEventsRef = db.collection(collectionName.VotingEvent);

  if (userData.relatedVotingEvents.length > 0) {
    const q = votingEventsRef.where(FieldPath.documentId(), "in", userData.relatedVotingEvents);
    const userVotingEvents = await q.get() as FirebaseFirestore.QuerySnapshot<IVotingEvent>;

    return userVotingEvents.docs
        .map((doc) => new VotingEvent()
            .fill({...doc.data(), id: doc.id}).toObj());
  }

  return [];
});
