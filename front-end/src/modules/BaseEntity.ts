import {
  CollectionReference, doc, DocumentReference, QueryDocumentSnapshot, setDoc, SetOptions, Timestamp, Transaction,
} from 'firebase/firestore';
import { IBaseEntity } from '~/shared/core';

export const BaseEntityConverter = {
  fillEntity: <T extends IBaseEntity>(snapshot: QueryDocumentSnapshot<T>): T => {
    const {
      createdAt, updatedAt, deletedAt, ...data
    } = snapshot.data();

    return {
      ...data,
      id: snapshot.id,
      updatedAt: (updatedAt as unknown as Timestamp)?.toDate(),
      createdAt: (createdAt as unknown as Timestamp)?.toDate(),
      deletedAt: (deletedAt as unknown as Timestamp)?.toDate(),
    } as T;
  },
};

type SaveOptions = SetOptions & {
  transaction?: Transaction;
}

/**
 * Automatically attach to transaction if transaction is provided.
 */
export const save = async <T extends IBaseEntity>(
  { id, ...data }: T, ref: DocumentReference<T> | CollectionReference, { transaction, ...setOpts }: SaveOptions = {},
): Promise<void> => {
  const docRef = ref instanceof DocumentReference ? ref : doc(ref, id);

  if (transaction) {
    return void transaction.set(docRef, data, setOpts);
  }
  return setDoc(docRef, data, setOpts);
};
