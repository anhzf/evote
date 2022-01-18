import {
  reactive, computed, toRef, watch, Ref,
} from 'vue';
import { useRouter, RouteLocationRaw } from 'vue-router';
import { createGlobalState } from '@vueuse/core';
import { getAuth } from 'src/firebase';
import { GuardType } from 'src/constant';
import { User } from 'firebase/auth';
import { Loading } from 'quasar';

const AUTH_FAILS_REDIRECT: RouteLocationRaw = '/';
const GUEST_FAILS_REDIRECT: RouteLocationRaw = '/';

export const useAuthStore = createGlobalState(() => {
  const state = reactive({
    user: getAuth().currentUser,
    isReady: false,
    guardRequests: [] as GuardType[],
  });
  const router = useRouter();
  const requestedGuard = computed<GuardType>(() => {
    if (state.guardRequests.includes('auth')) {
      return 'auth';
    }

    if (state.guardRequests.includes('guest')) {
      return 'guest';
    }

    return 'default';
  });
  const requestGuard = (guard: GuardType) => {
    state.guardRequests.push(guard);

    return () => {
      const index = state.guardRequests.indexOf(guard);
      if (index !== -1) {
        state.guardRequests.splice(index, 1);
      }
    };
  };
  const onAuthenticating = async (fn: CallableFunction) => {
    state.isReady = false;
    await fn();
    state.isReady = true;
  };

  watch(() => [
    requestedGuard.value,
    state.user !== null,
    state.isReady,
  ] as const, ([guard, isAuthenticated, isReady]) => {
    if (isReady) {
      if (guard === 'auth' && !isAuthenticated) {
        void router.push(AUTH_FAILS_REDIRECT);
      }
      if (guard === 'guest' && isAuthenticated) {
        void router.push(GUEST_FAILS_REDIRECT);
      }
    }
  }, { immediate: true });

  watch(() => [
    requestedGuard.value,
    state.isReady,
  ] as const, ([guard, isReady]) => {
    if (guard === 'auth' && !isReady) {
      Loading.show({ message: 'Authenticating...' });
    }

    if (state.isReady) {
      Loading.hide();
    }
  }, { immediate: true });

  return {
    user: toRef(state, 'user') as Ref<User | null>,
    isReady: toRef(state, 'isReady'),
    requestGuard,
    onAuthenticating,
  };
});
