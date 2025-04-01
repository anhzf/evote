<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { useCurrentUser, useSignIn, useSignOut } from '~/lib/queries/auth';

const { data: user, isLoading: isUserLoading } = useQuery(useCurrentUser());

const { mutate: signIn } = useSignIn();
const { mutate: signOut } = useSignOut();

useHead({
  link: [
    () => user.value?.photoURL ? {
      rel: 'preload',
      as: 'image',
      href: user.value?.photoURL,
    } : null,
  ],
});
</script>

<template>
  <div class="sticky top-0 inset-x-0 bg-(--ui-bg) border-b border-(--ui-border-muted)">
    <UContainer class="h-16 flex justify-between items-center gap-4 ">
      <slot />

      <div class="ml-auto">
        <template v-if="!isUserLoading">
          <div
            v-if="user"
            class="flex items-center gap-2"
          >
            <UDropdownMenu
              :items="[
                [
                  { label: user.displayName, avatar: { src: user.photoURL, alt: user.displayName, size: 'sm' } },
                ],
                [
                  { label: 'Sign out', as: 'button', onSelect: () => signOut(), icon: 'i-lucide-log-out' },
                ],
              ]"
              :ui="{
                content: 'min-w-40',
              }"
            >
              <UButton
                :avatar="{
                  src: user.photoURL,
                  alt: user.displayName,
                  size: 'sm',
                  // @ts-ignore
                  preload: true,
                }"
                variant="ghost"
                color="neutral"
              />
            </UDropdownMenu>
          </div>

          <UButton
            v-else
            type="button"
            @click="signIn()"
          >
            Masuk
          </UButton>
        </template>

        <div
          v-else
          class="flex items-center gap-2"
        >
          <USkeleton class="h-8 w-16 rounded-full" />
        </div>
      </div>
    </UContainer>
  </div>
</template>
