import { singleton } from '@anhzf/evote-shared/utils';
import { connectAuthEmulator } from 'firebase/auth';
import { Loading, Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import config from 'src/config';
import { watch } from 'vue';
import { RouteLocationNormalized } from 'vue-router';
import { getCurrentUser, useCurrentUser, useFirebaseAuth } from 'vuefire';

const isRequireAuth = (route: RouteLocationNormalized) => (route.meta.requiresAuth === undefined
  ? true
  : route.meta.requiresAuth);

const initAuth = singleton(() => {
  const auth = useFirebaseAuth();

  if (config.firebase.useEmulator) {
    connectAuthEmulator(auth!, `http://${config.firebase.emulatorHost}:${config.firebase.emulatorPort.auth}`);
  }
});

export default boot(({ router }) => {
  /** TODO: Refactor to use same logic in NavigationGuard below */
  const watchGuardTransition = singleton(() => {
    const user = useCurrentUser();

    watch([() => isRequireAuth(router.currentRoute.value), user], async ([requireAuth, _user]) => {
      await router.isReady();

      const route = router.currentRoute.value;

      if (requireAuth) {
        if (!_user) {
          router.push({
            name: route.params.votingEventName ? 'VotingEvent' : 'Home',
            params: route.params,
          });
        }

        if (route.redirectedFrom) {
          router.push(route.redirectedFrom);
        }
      }
    });
  });

  router.beforeEach(async (to) => {
    const stopLoading = Loading.show({ message: 'Sedang mengautentikasi...' });

    initAuth();
    watchGuardTransition();

    if (isRequireAuth(to)) {
      const currentUser = await getCurrentUser();
      stopLoading();
      // if the user is not logged in, redirect to the voting home page if any, or the home page
      if (!currentUser) {
        Notify.create({
          message: 'Anda tidak memiliki akses ke halaman ini',
          color: 'negative',
        });

        return {
          name: to.params.votingEventName ? 'VotingEvent' : 'Home',
          params: to.params,
        };
      }

      if (to.redirectedFrom) {
        return to.redirectedFrom;
      }
    }

    stopLoading();
    return true;
  });
});
