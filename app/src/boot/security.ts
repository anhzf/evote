import { singleton } from '@anhzf/evote-shared/utils';
import { connectAuthEmulator } from 'firebase/auth';
import { Loading } from 'quasar';
import { boot } from 'quasar/wrappers';
import config from 'src/config';
import { getCurrentUser, useFirebaseAuth } from 'vuefire';

const initAuth = singleton(() => {
  const auth = useFirebaseAuth();

  if (config.firebase.useEmulator) {
    connectAuthEmulator(auth!, `http://${config.firebase.emulatorHost}:${config.firebase.emulatorPort.auth}`);
  }
});

export default boot(({ router }) => {
  router.beforeEach(async (to) => {
    const stopLoading = Loading.show({ message: 'Sedang mengautentikasi...' });

    initAuth();

    const requiresAuth = to.meta.requiresAuth === undefined
      ? true
      : to.meta.requiresAuth;

    if (requiresAuth) {
      const currentUser = await getCurrentUser();
      stopLoading();
      // if the user is not logged in, redirect to the voting home page if any, or the home page
      if (!currentUser) {
        return {
          name: to.params.votingEventName ? 'VotingEvent' : 'Home',
          params: to.params,
          query: {
            // we keep the current path in the query so we can redirect to it after login
            // with `router.push(route.query.redirectTo || '/')`
            redirectTo: to.fullPath,
          },
        };
      }
    }

    stopLoading();
    return true;
  });
});
