import * as functions from 'firebase-functions';
import {DocumentReference, Timestamp} from 'firebase-admin/firestore';
import {getDb} from './utils/firebase';
import * as fromSrc from './lib/models';
import {dbRef} from './utils/firestore';

export const accept = functions.https.onCall(async (invitationId, context) => {
  // Only allow authenticated users to accept invitation
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please login to accept invitation');
  }

  if (!invitationId) {
    throw new functions.https.HttpsError('invalid-argument', 'invitationId is required');
  }

  const db = getDb();

  // Update invitation records
  return db.runTransaction(async (t) => {
    const invitationRef = db.doc(invitationId) as DocumentReference<fromSrc.Invitation>;
    const invitationSnapshot = await t.get(invitationRef);

    if (!invitationSnapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'Invitation not found');
    }

    const invitation = invitationSnapshot.data()!;

    if (invitation.acceptedAt) {
      throw new functions.https.HttpsError('already-exists', 'Invitation already accepted');
    }

    t.update(invitationRef, {
      acceptedAt: Timestamp.now(),
    });

    // If email matches, create voting event user and assign some data
    if (invitation.email === context.auth?.token.email && invitation.role) {
      const [, votingEventId] = invitationRef.path.match(new RegExp(dbRef.invitations('(.+)').doc('(.+)').path))!;
      const votingEventUserRef = dbRef.votingEventUsers(votingEventId).doc(context.auth!.uid);

      t.set(votingEventUserRef, <Partial<fromSrc.VotingEventUser>>{
        role: invitation.role,
      });
    }
  });
});
