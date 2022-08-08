import {BaseEntity} from "@evote/core";

export const saveEntity = <I, A, E extends BaseEntity<I, A>>(entity: E, docRef: FirebaseFirestore.DocumentReference<I>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...data} = entity.toObj();

  return docRef.set(data as unknown as I, {merge: true});
};
