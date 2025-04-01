import * as v from 'valibot';
import { SessionPath } from './session';
import { TimestampsSchema } from './common';

export const VotablePath = SessionPath.childTemplate('votables/{votable}');

export const Votable = v.object({
  ...TimestampsSchema.entries,
  title: v.string(),
  subtitle: v.optional(v.string()),
  desc: v.optional(v.string(), ''),
  number: v.optional(v.number()),
});
