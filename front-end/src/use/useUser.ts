import {
  Ref, onUnmounted, readonly, DeepReadonly,
} from 'vue';
import { GuardType } from 'src/constant';
import { useAuthStore } from 'src/store/useAuthStore';
import { User } from 'firebase/auth';

export const useUser = (guardType: GuardType = 'default'): DeepReadonly<Ref<(typeof guardType extends 'auth' ? User : (User | null))>> => {
  const { user, requestGuard } = useAuthStore();
  const removeGuardRequest = requestGuard(guardType);

  onUnmounted(() => {
    removeGuardRequest();
  });

  return readonly(user);
};
