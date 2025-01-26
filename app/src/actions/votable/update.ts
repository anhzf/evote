import { defineOperation } from 'actions/define-operation';
import {
  doc, runTransaction, Timestamp,
} from 'firebase/firestore';
import { ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { getDb, getStorage } from 'src/firebase';

interface Payload {
  votingEventId: string;
  uid: string;
  title?: string;
  subtitle?: string;
  desc?: string;
  img?: File | null;
}

const operation = defineOperation<Payload, void>({
  name: 'votable:update',
  handler: async ({
    img: file, uid, votingEventId, ...changes
  }) => {
    const votableDoc = doc(getDb(), 'VotingEvent', votingEventId, 'Votable', uid);

    await runTransaction(getDb(), async (trx) => {
      trx.update(votableDoc, JSON.parse(JSON.stringify(changes)));

      if (file) {
        const fileRef = ref(getStorage(), votableDoc.path);
        const result = await uploadBytes(fileRef, file);
        await updateMetadata(result.ref, {
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
