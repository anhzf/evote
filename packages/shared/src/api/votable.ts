import { doc, getDocs } from 'firebase/firestore';
import { createEntity } from '../create-entity';
import type { SessionPath } from '../entity/session';
import { Votable, VotablePath } from '../entity/votable';
import { getFirestore } from '../setup';

export const makeEntity = createEntity(VotablePath, Votable);

export const all = async (sessionPath: typeof SessionPath) => {
  const coll = doc(
    getFirestore(),
    VotablePath.fills({ session: sessionPath.params.session }).path,
  ).parent;
  const snapshots = await getDocs(coll);
  return snapshots.docs.map(makeEntity);
};
