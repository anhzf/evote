import {
  Model as _Model,
  UserData as _UserData,
  Votable as _Votable,
  Voter as _Voter,
  VoteToken as _VoteToken,
  VotingEvent as _VotingEvent,
} from '@anhzf/evote-shared/models';
import {DocumentReference, Timestamp} from 'firebase-admin/firestore';

export interface Model extends Omit<_Model, 'uid' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
}

export interface UserData extends Omit<_UserData, keyof Model | 'relatedVotingEvents'>, Model {
  relatedVotingEvents: DocumentReference<VotingEvent>[];
}

export interface VotingEvent extends Omit<_VotingEvent, keyof Model>, Model {}

export interface Voter extends Omit<_Voter, keyof Model>, Model {}

export interface Votable extends Omit<_Votable, keyof Model | 'ref'>, Model {
  ref?: DocumentReference<UserData>;
}

export interface VoteToken extends Omit<_VoteToken, keyof Model | 'voter' | 'voted'>, Model {
  voter: DocumentReference<Voter>;
  voted?: DocumentReference<Votable>;
}
