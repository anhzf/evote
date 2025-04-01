import * as v from 'valibot';
import { createEntity } from '../create-entity';
import { Voter, VoterPath } from '../entity/voter';
import { addDoc } from 'firebase/firestore';

export const makeEntity = createEntity(VoterPath, Voter);

export const CreateSchema = v.object({
  ...Voter.entries,
  sessionId: v.string(),
});

export const create = async ({ sessionId, ...data }: v.InferOutput<typeof CreateSchema>): Promise<string> => {
  const coll = VoterPath.fills({ session: sessionId }).toCollectionRef();
  const doc = await addDoc(coll, data);
  return doc.id;
};
