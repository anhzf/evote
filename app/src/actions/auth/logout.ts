import { signOut } from 'firebase/auth';
import { defineOperation } from 'actions/define-operation';
import { getAuth } from 'src/firebase';

const operation = defineOperation<never, void>({
  name: 'auth:logout',
  handler: async () => {
    await signOut(getAuth());
  },
});

export default operation;
