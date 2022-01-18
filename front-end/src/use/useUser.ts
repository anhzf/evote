import { onUnmounted, readonly } from 'vue';
import { GuardType } from 'src/constant';
import { useAuthStore } from 'src/store/useAuthStore';

export const useUser = (guardType: GuardType = 'default') => {
  const { user, requestGuard } = useAuthStore();
  const removeGuardRequest = requestGuard(guardType);

  onUnmounted(() => {
    removeGuardRequest();
  });

  return readonly(user);
};
