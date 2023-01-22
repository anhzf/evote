import {
  CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, Query, QuerySnapshot,
} from 'firebase/firestore';
import { computedAsync, MaybeRef } from '@vueuse/core';
import {
  computed, isRef, Ref, watch,
} from 'vue';

export const useDoc = <T = DocumentData>(
  maybeDocRef: MaybeRef<DocumentReference<T>>,
): Ref<DocumentSnapshot<T> | undefined> => {
  // const docRef = isRef(maybeDocRef) ? maybeDocRef.value : maybeDocRef;
  // const snapshot = computedAsync(() => getDoc(docRef));
  const docRef = isRef(maybeDocRef) ? maybeDocRef : computed(() => maybeDocRef);
  const snapshot = computedAsync(() => getDoc(docRef.value));
  return snapshot;
};

export const useDocs = <T = DocumentData>(
  maybeCollectionRef: MaybeRef<CollectionReference<T> | Query<T>>,
): Ref<QuerySnapshot<T> | undefined> => {
  // const collectionRef = isRef(maybeCollectionRef) ? maybeCollectionRef.value : maybeCollectionRef;
  // const snapshot = computedAsync(() => getDocs(collectionRef));
  const collectionRef = isRef(maybeCollectionRef) ? maybeCollectionRef : computed(() => maybeCollectionRef);
  const snapshot = computedAsync(() => getDocs(collectionRef.value));
  watch(snapshot, (v) => console.log(v), { immediate: true });
  return snapshot;
};
