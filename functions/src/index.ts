import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {getAuth as fbGetAuth} from "firebase-admin/auth";
import {FieldPath, FieldValue, getFirestore} from "firebase-admin/firestore";
// import {IVoteObject, IVoteToken, IVotingEvent, UserData, VoteToken, VotingEvent} from "@evote/core/dist/cjs";
import {IVoteObject, IVoteToken, IVotingEvent, UserData, VoteToken, VotingEvent} from "../../shared/core";
import {collectionName as cn, votingEventInfoKey} from "../../shared/firestoreReferences";
import {singleton} from "./utils/function";

initializeApp();

const getDb = singleton(() => getFirestore());

getDb().settings({
  ignoreUndefinedProperties: true,
});

const getAuth = singleton(() => fbGetAuth());

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const docRef = getDb().doc(`${cn.UserData}/${user.uid}`);

  await docRef.set({
    createdAt: new Date(),
  }, {merge: true});
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const docRef = getDb().doc(`${cn.UserData}/${user.uid}`);

  await docRef.delete();
});

export const onVotingEventWriteVoter = functions.firestore
    .document(`${cn.VotingEvent}/{votingEventId}/${cn.Voter}/{voterId}`)
    .onWrite(async (change, context) => {
      const votingEventId = context.params.votingEventId;
      const votingEventInfoVoterCacheDocRef = getDb().doc(`${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.voterMeta}`);

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

export const onVoteTokenChange = functions.firestore
    .document(`${cn.VotingEvent}/{votingEventId}/${cn.VoteToken}/{voteTokenId}`)
    .onWrite(async (change, context) => {
      const votingEventId = context.params.votingEventId;
      const votingEventInfoSummaryDocRef = getDb()
          .doc(`${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.summary}`);

      if (!change.before.exists) {
        // New document created
        votingEventInfoSummaryDocRef.set({total: FieldValue.increment(1)}, {merge: true});
      } else if (change.before.exists && change.after.exists) {
        // Updating existing document
        const data = change.after.data() as IVoteToken;
        const voted = data.voted as (FirebaseFirestore.DocumentReference<IVoteObject> | undefined);

        // If voted, increment voted and used count. otherwise, decrement voted and used count.
        if (voted) {
          votingEventInfoSummaryDocRef.set({
            [voted.id]: FieldValue.increment(1),
            used: FieldValue.increment(1),
          }, {merge: true});
        } else {
          const oldData = change.before.data() as IVoteToken;
          const oldVoted = oldData.voted as (FirebaseFirestore.DocumentReference<IVoteObject> | undefined);

          if (oldVoted) {
            votingEventInfoSummaryDocRef.set({
              [oldVoted.id]: FieldValue.increment(-1),
              used: FieldValue.increment(-1),
            }, {merge: true});
          }
        }
      } else if (!change.after.exists) {
        // Deleting document
        const data = change.before.data() as IVoteToken;
        const voted = data.voted as (FirebaseFirestore.DocumentReference<IVoteObject> | undefined);

        if (voted) {
          votingEventInfoSummaryDocRef.set({
            [voted.id]: FieldValue.increment(-1),
            used: FieldValue.increment(-1),
            total: FieldValue.increment(-1),
          }, {merge: true});
        }
      }
    });

interface getDocumentsByFullPathData {
  paths?: string[];
}

export const getDocumentsByFullPath = functions.https.onCall(async (data) => {
  const {paths = []} = data as getDocumentsByFullPathData;
  const db = getDb();
  const refs = paths.map((path) => db.doc(path));
  const result = await db.getAll(...refs);

  return result.map((el) => el.data());
});

export const getUserVotingEvents = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const snapshot = await getDb().doc(`${cn.UserData}/${context.auth.uid}`).get();
  const userData = new UserData().fill({...snapshot.data(), id: snapshot.id});

  const votingEventsRef = getDb().collection(cn.VotingEvent);

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

  const collectionRef = getDb().collection(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}`);
  const voterRef = getDb().doc(`${cn.VotingEvent}/${votingEventId}/${cn.Voter}/${voterId}`);

  const q = collectionRef
      .where("voter", "==", voterRef)
      .where("deletedAt", "==", null)
      .limit(1);
  const {docs: [picked]} = await q.get() as FirebaseFirestore.QuerySnapshot<IVoteToken>;

  if (picked) {
    return new VoteToken().fill({...picked.data(), id: picked.id}).toObj();
  }

  // create the new ones
  const newDocRef = collectionRef.doc();
  const voteToken = new VoteToken().fill({id: newDocRef.id, voter: voterId});
  const {id, ...tokenData} = voteToken.toObj();

  await newDocRef.set({...tokenData, voter: voterRef}, {merge: true});

  return voteToken.toObj();
});

export const loginWithVoteToken = functions.https.onCall(async (data) => {
  const {votingEventId, voteToken} = data;

  if (!votingEventId || !voteToken) {
    throw new functions.https.HttpsError("invalid-argument", "votingEventId and voteTokenId are required");
  }

  const docRef = getDb().doc(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}/${voteToken}`);
  const snapshot = await docRef.get() as FirebaseFirestore.DocumentSnapshot<IVoteToken>;
  const docData = snapshot.data();

  if (snapshot.exists && !docData?.deletedAt) {
    const claims = {
      scope: votingEventId,
    };

    return getAuth().createCustomToken(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}/${voteToken}`, claims);
  }

  throw new functions.https.HttpsError("unauthenticated", "Invalid vote token");
});

export const vote = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const {votingEventId, voteToken, vote} = data as Partial<{votingEventId: string; voteToken: string; vote: string;}>;

  if (!votingEventId || !voteToken || !vote) {
    throw new functions.https.HttpsError("invalid-argument", "votingEventId, voteTokenId and vote are required");
  }

  const docRef = getDb().doc(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}/${voteToken}`);
  const snapshot = await docRef.get() as FirebaseFirestore.DocumentSnapshot<IVoteToken>;

  if (snapshot.exists) {
    const {voted} = snapshot.data()!;

    if (voted) {
      throw new functions.https.HttpsError("already-exists", "Vote token has already been used");
    }

    docRef.update({voted: getDb().doc(`${cn.VotingEvent}/${votingEventId}/${cn.VoteObject}/${vote}`)});

    return;
  }

  throw new functions.https.HttpsError("unauthenticated", "Invalid vote token");
});

interface validateVoteResultData {
  votingEventId: string;
}

export const getVoteResult = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const {votingEventId} = data as validateVoteResultData;

  if (!votingEventId) {
    throw new functions.https.HttpsError("invalid-argument", "votingEventId is required");
  }

  const db = getDb();
  const collectionRef = db.collection(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}`);
  const snapshots = await collectionRef.get() as FirebaseFirestore.QuerySnapshot<IVoteToken>;
  const voteTokens = snapshots.docs.map((doc) => new VoteToken().fill({...doc.data(), id: doc.id}).toObj());
  const countPerVoteObject = voteTokens.reduce((acc, cur) => {
    const voteObject = cur.voted as FirebaseFirestore.DocumentReference | undefined;

    if (voteObject) {
      acc[voteObject.id] = (acc[voteObject.id] || 0) + 1;
    }

    return acc;
  }, {} as {[key: string]: number});
  const usedVoteToken = voteTokens.filter((cur) => cur.voted).length;

  return {
    counts: countPerVoteObject,
    totalUsed: usedVoteToken,
    total: voteTokens.length,
  };
});
interface validateVoteResultData {
  votingEventId: string;
}

export const validateVoteResult = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated");
  }

  const {votingEventId} = data as validateVoteResultData;

  if (!votingEventId) {
    throw new functions.https.HttpsError("invalid-argument", "votingEventId is required");
  }

  const db = getDb();

  return db.runTransaction(async (transaction) => {
    const collectionRef = db.collection(`${cn.VotingEvent}/${votingEventId}/${cn.VoteToken}`);
    const snapshots = await transaction.get(collectionRef) as FirebaseFirestore.QuerySnapshot<IVoteToken>;
    const voteTokens = snapshots.docs.map((doc) => new VoteToken().fill({...doc.data(), id: doc.id}).toObj());
    const countPerVoteObject = voteTokens.reduce((acc, cur) => {
      const voteObject = cur.voted as FirebaseFirestore.DocumentReference | undefined;

      if (voteObject) {
        acc[voteObject.id] = (acc[voteObject.id] || 0) + 1;
      }

      return acc;
    }, {} as {[key: string]: number});
    const usedVoteToken = voteTokens.filter((cur) => cur.voted).length;

    const votingEventInfoSummaryDocRef = db
        .doc(`${cn.VotingEvent}/${votingEventId}/Info/${votingEventInfoKey.summary}`);


    transaction.update(votingEventInfoSummaryDocRef, {
      used: usedVoteToken,
      total: voteTokens.length,
      ...countPerVoteObject,
    });
  });
});
