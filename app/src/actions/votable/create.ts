import { defineOperation } from 'actions/define-operation';
import {
  collection, doc, runTransaction, Timestamp,
} from 'firebase/firestore';
import { ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { getDb, getStorage } from 'src/firebase';

interface Payload {
  votingEventId: string;
  title: string;
  subtitle: string;
  desc?: string;
  img?: File | null;
}

const operation = defineOperation<Payload, void>({
  name: 'votable:create',
  handler: async ({ img: file, votingEventId, ...payload }) => {
    const coll = collection(getDb(), 'VotingEvent', votingEventId, 'Votable');

    await runTransaction(getDb(), async (trx) => {
      // TODO: Automatically infer votable number

      const votableDoc = doc(coll);
      trx.set(votableDoc, {
        ...payload,
        createdAt: Timestamp.now(),
      });

      if (file) {
        const fileRef = ref(getStorage(), votableDoc.path);
        await uploadBytes(fileRef, file);
        await updateMetadata(fileRef, {
          contentType: file.type,
          customMetadata: {
            originalName: file.name,
          },
        });
      }
    });
  },
});

export default operation;
