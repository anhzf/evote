import * as v from 'valibot';
import { SessionPath } from '../entity/session';
import { DateSchema, TimestampsSchema } from './common';

export const VoteTokenPath = SessionPath.childTemplate('vote-tokens/{voteToken}');

export const VoteToken = v.object({
  ...TimestampsSchema.entries,
  expiresAt: DateSchema,
  used: v.boolean(),
  // Hash of user identifier (for verification without storing actual user ID)
  // This allows checking if a user already voted without revealing who they are
  hash: v.string(),
  metadata: v.object({
    labels: v.array(v.string()),
  }),
});
