import { setupFirestore } from '@anhzf/evote-shared/setup';
import { getDb } from '~/lib/services/firebase';

export default defineNuxtPlugin(() => {
  setupFirestore(getDb);
});
