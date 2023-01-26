import { VotingEvent } from '@anhzf/evote-shared/models';
import { createGlobalState } from '@vueuse/core';
import {
  collection, CollectionReference, limit, query, Timestamp, where,
} from 'firebase/firestore';
import { useDocs } from 'src/composables/use-firestore';
import { getDb } from 'src/firebase';
import { computed, inject, Ref } from 'vue';
import { useRoute } from 'vue-router';

interface $useVotingEvent {
  (): Ref<VotingEvent | undefined>;
}

interface FromFirestore {
  title: string;
  url: string;
  isClosed?: boolean;
  createdAt: Timestamp;
  deletedAt?: Timestamp;
}

/**
 * Firestore implementation
 */
const _useVotingEvent: $useVotingEvent = () => {
  const route = useRoute();
  const q = computed(() => {
    const slug = route.params.votingEventName as string;
    const collectionRef = collection(getDb(), 'VotingEvent') as CollectionReference<FromFirestore>;
    const _q = query(collectionRef, where('url', '==', slug), limit(1));
    return _q;
  });
  const source = useDocs(q);

  return computed(() => {
    const val = source.value?.docs[0];

    if (val) {
      const data = val.data();
      return <VotingEvent>{
        ...data,
        uid: val.id,
        createdAt: data?.createdAt?.toDate(),
        deletedAt: data?.deletedAt?.toDate(),
      };
    }

    return undefined;
  });
};

const useVotingEvent = createGlobalState(_useVotingEvent);

export default useVotingEvent;
