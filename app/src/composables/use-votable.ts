import { Votable } from '@anhzf/evote-shared/models';
import {
  collection, CollectionReference, DocumentReference, QueryDocumentSnapshot, Timestamp,
} from 'firebase/firestore';
import { ref as refStorage } from 'firebase/storage';
import { useDocs } from 'src/composables/use-firestore';
import { useInjectedVotingEvent } from 'src/composables/use-voting-event';
import { getDb, getStorage } from 'src/firebase';
import { computed, Ref } from 'vue';

interface _useVotableList {
  (): Ref<Votable[]>;
}

interface FromFirestore {
  title: string;
  subtitle: string;
  createdAt: Timestamp;
  ref?: DocumentReference;
  desc?: string;
}

const getCollectionRef = (votingEventId: string) => (
  collection(getDb(), 'VotingEvent', votingEventId, 'Votable')
) as CollectionReference<FromFirestore>;

const getVotableImgRef = (votableRef: DocumentReference) => refStorage(getStorage(), votableRef.path);

const fromSource = (snapshot: QueryDocumentSnapshot<FromFirestore>) => {
  const data = snapshot.data();

  return {
    ...data,
    createdAt: data.createdAt.toDate(),
    ref: data.ref?.path,
    thumbnailSrc: getVotableImgRef(snapshot.ref).toString(),
    uid: snapshot.id,
  };
};

/**
 * Firestore implementation
 */
export const useVotableList: _useVotableList = () => {
  const votingEvent = useInjectedVotingEvent();
  const collectionRef = computed(() => getCollectionRef(votingEvent.value!.uid));
  const snapshot = useDocs(collectionRef);

  return computed<Votable[]>(() => snapshot.value?.docs.map(fromSource) || []);
};
