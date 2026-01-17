import { FirebaseUser } from '@anhzf/evote-shared';
import { queryOptions, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { AuthProvider } from 'firebase/auth';
import { GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';
import * as v from 'valibot';
import { getAuth } from '~/lib/services/firebase';

const provider: AuthProvider = new GoogleAuthProvider();

export const useCurrentUser = () => {
  return queryOptions({
    queryKey: ['user'],
    queryFn: () => new Promise<v.InferOutput<typeof FirebaseUser> | null>(
      (resolve, reject) => {
        const unsub = onIdTokenChanged(getAuth(), (user) => {
          if (user) resolve(v.parse(FirebaseUser, user));
          else resolve(null);
          unsub();
        }, reject);
      }
    ),
    suspense: false,
    enabled: isMounted(),
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { user } = await signInWithPopup(getAuth(), provider);
      return v.parse(FirebaseUser, user);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(useCurrentUser().queryKey, data);
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await signOut(getAuth());
    },
    onSuccess: () => {
      queryClient.setQueryData(useCurrentUser().queryKey, null);
    },
  });
};
