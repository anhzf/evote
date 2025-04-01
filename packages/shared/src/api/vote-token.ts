import { createHash } from 'crypto';
import { runTransaction } from 'firebase/firestore';
import { customAlphabet } from 'nanoid';
import * as v from 'valibot';
import { createEntity, type IEntity } from '../create-entity';
import { SessionInternal, SessionInternalPath } from '../entity/session';
import { VoteToken, VoteTokenPath } from '../entity/vote-token';
import { Voter, VoterPath } from '../entity/voter';
import { getFirestore } from '../setup';
import { shouldOnServer } from '../utils/api';

export const makeEntity = createEntity(VoteTokenPath, VoteToken);
const makeSessionInternalEntity = createEntity(SessionInternalPath, SessionInternal);

const hashToken = shouldOnServer(
  (voter: IEntity<typeof VoterPath, typeof Voter>, sessionInternal: IEntity<typeof SessionInternalPath, typeof SessionInternal>): string => {
    const content = [
      voter.path,
      sessionInternal.data.tokenSalt,
    ].join('-');

    return createHash('sha256')
      .update(content)
      .digest('hex');
  },
);

export const create = shouldOnServer(
  async (voter: IEntity<typeof VoterPath, typeof Voter>, expInHours: number, tokenLength = 5): Promise<string> => {
    return runTransaction(getFirestore(), async (trx) => {
      const now = new Date();
      const genToken = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      const token = genToken(tokenLength);

      const sessionInternalDoc = SessionInternalPath.toDocRef();
      const sessionInternal = makeSessionInternalEntity(await trx.get(sessionInternalDoc));
      const expiresAt = new Date(now.getTime() + expInHours * 3600_000);
      const tokenPayload = v.parse(VoteToken, {
        hash: hashToken(voter, sessionInternal),
        metadata: {
          labels: voter.data.labels,
        },
        used: false,
        expiresAt,
        createdAt: now,
        updatedAt: now,
      } satisfies v.InferInput<typeof VoteToken>);

      const tokenDoc = VoteTokenPath.fills({
        session: voter.docPath.params.session,
        voteToken: token,
      }).toDocRef();

      trx.set(tokenDoc, tokenPayload);

      return token;
    });
  },
);
