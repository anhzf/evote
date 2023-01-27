import {CollectionReference} from 'firebase-admin/firestore';
import * as fromSrc from '../lib/models';
import {getDb} from './firebase';

export const dbRef = {
  userDatas: () => getDb().collection('UserData') as CollectionReference<fromSrc.UserData>,

  votingEvents: () => getDb().collection('VotingEvent') as CollectionReference<fromSrc.VotingEvent>,

  votables: (votingEventId: string) => dbRef.votingEvents().doc(votingEventId)
      .collection('Votable') as CollectionReference<fromSrc.Votable>,

  voteTokens: (votingEventId: string) => dbRef.votingEvents().doc(votingEventId)
      .collection('VoteToken') as CollectionReference<fromSrc.VoteToken>,

  voters: (votingEventId: string) => dbRef.votingEvents().doc(votingEventId)
      .collection('Voter') as CollectionReference<fromSrc.Voter>,

  votingEventUsers: (votingEventId: string) => dbRef.votingEvents().doc(votingEventId)
      .collection('User') as CollectionReference<fromSrc.VotingEventUser>,

  invitations: (votingEventId: string) => dbRef.votingEvents().doc(votingEventId)
      .collection('Invitation') as CollectionReference<fromSrc.Invitation>,
};
