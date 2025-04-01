import { doc, type DocumentSnapshot } from 'firebase/firestore';
import type { DocPath } from './doc';
import { parse, type InferOutput, type ObjectSchema } from 'valibot';

export interface IEntity<P extends DocPath<string>, D extends ObjectSchema<any, any>> {
  readonly data: InferOutput<D>;
  readonly id: string;
  readonly path: string;
  readonly docPath: P;
}

export const createEntity = <P extends string, S extends ObjectSchema<any, any>>(path: DocPath<P>, schema: S) => (
  (snapshot: DocumentSnapshot): IEntity<DocPath<P>, S> => ({
    get data() {
      return parse(schema, snapshot.data());
    },
    get id() {
      return snapshot.id;
    },
    get path() {
      return snapshot.ref.path;
    },
    get docPath() {
      return path.fromString(snapshot.ref.path);
    },
  })
)
