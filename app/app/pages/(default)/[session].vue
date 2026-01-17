<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { useActiveSession } from '~/lib/queries/session';

const route = useRoute();

const { data: session, isLoading, suspense } = useQuery(useActiveSession());
await suspense();

useSeoMeta({
  title: session.value?.data.title,
});
</script>

<template>
  <div class="bg-muted min-h-screen flex flex-col">
    <AppTopNav>
      <div class="flex items-center gap-4">
        <ULink to="/">
          <h1 class="text-2xl font-bold text-dimmed">
            Evote /
          </h1>
        </ULink>

        <ULink :to="{ name: 'session', params: { session: session?.data.url } }">
          <h1 class="text-2xl font-bold text-highlighted">
            {{ session?.data.title }}
          </h1>
        </ULink>

        <UButton
          v-if="route.name === 'session'"
          :to="{ name: 'session-vote' }"
          variant="subtle"
          trailing-icon="i-lucide-move-right"
        >
          Vote Now
        </UButton>
      </div>
    </AppTopNav>

    <UContainer class="relative grow w-full">
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-slate-500/50 flex items-center justify-center"
      >
        <UIcon
          name="i-svg-spinners:90-ring-with-bg"
          class="size-8"
        />
      </div>

      <NuxtPage />
    </UContainer>
  </div>
</template>
