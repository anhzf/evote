import { computed, isRef, watch } from 'vue';
import { Notify } from 'quasar';
import { MaybeRef, useAsyncState, whenever } from '@vueuse/core';
import { Role, UserPrivilege, VotingEvent } from '@evote/core';
import { getUserPrivilege } from 'src/modules/UserPrivilege';
import { useUser } from 'src/use/useUser';

export const useUserPrivilege = (voting: MaybeRef<VotingEvent>, guardTruthyFactory = (() => true), guardFallback?: CallableFunction) => {
  const user = useUser();
  const _voting = computed(() => (isRef(voting) ? voting.value : voting));
  const {
    state: userPrivilege, isReady, isLoading, execute,
  } = useAsyncState(
    () => getUserPrivilege(_voting.value?.id),
    new UserPrivilege().fill({ id: user.value?.uid || '' }),
    { shallow: true, immediate: false },
  );
  const is = (role: Role) => isReady.value
    && userPrivilege.value?.role === role;
  const can = (...privileges: string[]) => isReady.value
    && privileges.some((privilege) => userPrivilege.value.can?.includes(privilege));

  whenever(() => isReady.value && !guardTruthyFactory(), () => {
    Notify.create({
      message: 'NO_PRIVILEGE',
      color: 'negative',
    });

    guardFallback?.();
  });

  watch(() => [_voting.value, user.value], () => execute());

  return {
    userPrivilege,
    isReady,
    isLoading,
    is,
    can,
  };
};
