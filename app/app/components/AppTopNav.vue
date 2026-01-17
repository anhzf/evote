<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui';
import { useQuery } from '@tanstack/vue-query';
import { useCurrentUser, useSignIn, useSignOut } from '~/lib/queries/auth';

const { data: user, isLoading: isUserLoading } = useQuery(useCurrentUser());

const { mutate: signIn } = useSignIn();
const { mutate: signOut } = useSignOut();

const userMenuItems = computed<DropdownMenuItem[]>(() => {
  if (user.value) {
    return [
      [
        {
          label: user.value.displayName,
          avatar: {
            src: user.value.photoURL,
            alt: user.value.displayName,
            size: 'sm',
            preload: true,
          },
          type: 'label',
        },
      ],
      [
        {
          label: 'Keluar',
          as: 'button',
          onSelect: () => signOut(),
          icon: 'i-lucide-log-out'
        },
      ],
    ];
  }

  return [];
});

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
  <div class="sticky top-0 inset-x-0 bg-default border-b border-muted">
    <UContainer class="h-16 flex justify-between items-center gap-4 ">
      <slot />

      <div class="ml-auto">
        <template v-if="!isUserLoading">
          <div
            v-if="user"
            class="flex items-center gap-2"
          >
            <UDropdownMenu
              :items="userMenuItems"
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
