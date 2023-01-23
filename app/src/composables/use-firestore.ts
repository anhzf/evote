import { computedAsync, MaybeRef } from '@vueuse/core';
import {
  CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, Query, QuerySnapshot,
} from 'firebase/firestore';
import { computed, isRef, Ref } from 'vue';

export const useDoc = <T = DocumentData>(
  maybeDocRef: MaybeRef<DocumentReference<T>>,
): Ref<DocumentSnapshot<T> | undefined> => {
  const docRef = isRef(maybeDocRef) ? maybeDocRef : computed(() => maybeDocRef);
  const snapshot = computedAsync(() => getDoc(docRef.value));
  return snapshot;
};

export const useDocs = <T = DocumentData>(
  maybeCollectionRef: MaybeRef<CollectionReference<T> | Query<T>>,
): Ref<QuerySnapshot<T> | undefined> => {
  const collectionRef = isRef(maybeCollectionRef) ? maybeCollectionRef : computed(() => maybeCollectionRef);
  const snapshot = computedAsync(() => getDocs(collectionRef.value));
  return snapshot;
};
