import { addDoc, doc, getDocs, limit, query, where } from 'firebase/firestore';
import * as v from 'valibot';
import { createEntity } from '../create-entity';
import { Session, SessionPath } from '../entity/session';
import { getFirestore } from '../setup';

export const Schema = Session;

export const Path = SessionPath;

export const makeEntity = createEntity(SessionPath, Session);

export const all = async () => {
  const coll = SessionPath.toCollectionRef();
  const snapshots = await getDocs(coll);
  return snapshots.docs.map(makeEntity);
};

export const findByUrl = async (url: string) => {
  const coll = doc(getFirestore(), SessionPath.path).parent;
  const q = query(coll, where('url', '==', url), limit(1));
  const snapshots = await getDocs(q);
  const [snap] = snapshots.docs;
  return makeEntity(snap);
};

export const CreateSchema = v.object({
  ...Session.entries,
  userId: v.string(),
});

/**
 * @returns string id of created session
 */
export const create = async ({ userId, ...data }: v.InferOutput<typeof CreateSchema>) => {
  const coll = SessionPath.toCollectionRef();
  const doc = await addDoc(coll, data);
  return doc.id;
};
