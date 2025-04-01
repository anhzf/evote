import * as v from 'valibot';
import { TimestampsSchema } from './common';
import { Person } from './person';
import { SessionPath } from './session';

export const VoterPath = SessionPath.childTemplate('voters/{voter}');

export const Voter = v.object({
  ...TimestampsSchema.entries,
  ...Person.entries,
  labels: v.array(v.string()),
});
