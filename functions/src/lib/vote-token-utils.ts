import {VoteToken, voteTokenOperations} from '@anhzf/evote-shared/models';
import {DocumentReference, QueryDocumentSnapshot, Timestamp} from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import {getDb} from '../utils/firebase';
import {VOTE_TOKEN_EXPIRATION} from './constants';
import {voteTokenConverter} from './converter';
import * as fromSrc from './models';

export interface TokenGroups {
  used: QueryDocumentSnapshot<fromSrc.VoteToken>[];
  available: QueryDocumentSnapshot<fromSrc.VoteToken>[];
  expired: QueryDocumentSnapshot<fromSrc.VoteToken>[];
}

export interface TokensByVoter {
  [voterPath: string]: TokenGroups;
}

/**
 * Group vote tokens by their availability status
 * @param {QueryDocumentSnapshot<fromSrc.VoteToken>[]} tokens - Array of token snapshots
 * @param {boolean} noTokenExpiration - Whether token expiration is disabled
 * @return {TokenGroups} Tokens grouped by status
 */
export const groupTokensByStatus = (
    tokens: QueryDocumentSnapshot<fromSrc.VoteToken>[],
    noTokenExpiration: boolean,
): TokenGroups => {
  return tokens.reduce<TokenGroups>(
      (acc, doc) => {
        const data = doc.data();

        if (data.voted) {
          acc.used.push(doc);
          return acc;
        }

        const expiredAt = data.createdAt.toMillis() + VOTE_TOKEN_EXPIRATION * 1000;

        if (expiredAt > Timestamp.now().toMillis()) {
          acc.available.push(doc);
        } else if (!noTokenExpiration) {
          acc.expired.push(doc);
        }

        return acc;
      },
      {available: [], used: [], expired: []},
  );
};

/**
 * Group tokens by their voter reference
 * @param {QueryDocumentSnapshot<fromSrc.VoteToken>[]} tokens - Array of token snapshots
 * @param {boolean} noTokenExpiration - Whether token expiration is disabled
 * @return {TokensByVoter} Tokens grouped by voter path
 */
export const groupTokensByVoter = (
    tokens: QueryDocumentSnapshot<fromSrc.VoteToken>[],
    noTokenExpiration: boolean,
): TokensByVoter => {
  const byVoter: TokensByVoter = {};

  tokens.forEach((doc) => {
    const data = doc.data();
    const voterPath = data.voter.path;

    if (!byVoter[voterPath]) {
      byVoter[voterPath] = {available: [], used: [], expired: []};
    }

    const status = getTokenStatus(data, noTokenExpiration);
    byVoter[voterPath][status].push(doc);
  });

  return byVoter;
};

/**
 * Determine a token's status
 * @param {fromSrc.VoteToken} token - The token to check
 * @param {boolean} noTokenExpiration - Whether token expiration is disabled
 * @return {keyof TokenGroups} The token status
 */
const getTokenStatus = (
    token: fromSrc.VoteToken,
    noTokenExpiration: boolean,
): keyof TokenGroups => {
  if (token.voted) {
    return 'used';
  }

  const expiredAt = token.createdAt.toMillis() + VOTE_TOKEN_EXPIRATION * 1000;
  const isExpired = expiredAt <= Timestamp.now().toMillis() && !noTokenExpiration;

  return isExpired ? 'expired' : 'available';
};

/**
 * Create a new vote token for a voter
 * @param {DocumentReference<fromSrc.Voter>} voterRef - Reference to the voter
 * @return {{token: VoteToken; src: fromSrc.VoteToken}} The created token and its source representation
 */
export const createVoteToken = (
    voterRef: DocumentReference<fromSrc.Voter>,
): {token: VoteToken; src: fromSrc.VoteToken} => {
  const voteToken: VoteToken = voteTokenOperations.create({
    voter: voterRef.path,
  });
  const voteTokenSrc = voteTokenConverter.toSrc(voteToken);

  return {token: voteToken, src: voteTokenSrc};
};

/**
 * Convert a source token document to a VoteToken
 * @param {QueryDocumentSnapshot<fromSrc.VoteToken>} doc - The token document snapshot
 * @return {VoteToken} The converted VoteToken
 */
export const sourceToVoteToken = (
    doc: QueryDocumentSnapshot<fromSrc.VoteToken>,
): VoteToken => {
  const data = voteTokenConverter.fromSrc(doc.data());
  return {
    ...data,
    uid: doc.id,
  };
};

/**
 * Validate voting event existence
 * @param {string} votingEventId - The voting event ID
 * @return {Promise<{noTokenExpiration: boolean}>} Voting event policies
 */
export const validateVotingEvent = async (
    votingEventId: string,
): Promise<{noTokenExpiration: boolean}> => {
  const votingEventRef = getDb()
      .collection('VotingEvent')
      .doc(votingEventId);

  const votingEvent = await votingEventRef.get();
  if (!votingEvent.exists) {
    throw new functions.https.HttpsError('not-found', 'Voting event not found');
  }

  const policies = votingEvent.data()?.policies;
  return {
    noTokenExpiration: policies?.noTokenExpiration || false,
  };
};
