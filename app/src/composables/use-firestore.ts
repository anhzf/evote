import {
  CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, Query, QuerySnapshot,
} from 'firebase/firestore';
import { computedAsync, MaybeRef } from '@vueuse/core';
import { isRef, Ref } from 'vue';

export const useDoc = <T = DocumentData>(
  maybeDocRef: MaybeRef<DocumentReference<T>>,
): Ref<DocumentSnapshot<T> | undefined> => {
  const docRef = isRef(maybeDocRef) ? maybeDocRef.value : maybeDocRef;
  const snapshot = computedAsync(() => getDoc(docRef));
  return snapshot;
};

export const useDocs = <T = DocumentData>(
  maybeCollectionRef: MaybeRef<CollectionReference<T> | Query<T>>,
): Ref<QuerySnapshot<T> | undefined> => {
  const collectionRef = isRef(maybeCollectionRef) ? maybeCollectionRef.value : maybeCollectionRef;
  const snapshot = computedAsync(() => getDocs(collectionRef));
  return snapshot;
};
