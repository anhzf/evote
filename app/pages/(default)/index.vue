<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { useSessions } from '~/lib/queries/session';

const { data, isLoading } = useQuery(useSessions());

useSeoMeta({
  title: 'Sessions',
});
</script>

<template>
  <div class="bg-(--ui-bg-muted) min-h-screen flex flex-col">
    <AppTopNav>
      <h1 class="text-2xl font-bold text-(--ui-text-highlighted)">
        Evote
      </h1>
    </AppTopNav>

    <UContainer class="grow w-full flex flex-col gap-8">
      <div class="py-8 flex flex-col gap-4">
        <h2 class="text-xl font-bold">
          Sessions
        </h2>

        <ul
          v-if="!isLoading"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <UCard
            v-for="({ data: el, id }) in data"
            :key="id"
            as="li"
            class="isolate relative hover:shadow-md transition-shadow"
          >
            <template #header>
              <div class="flex flex-col gap-1">
                <NuxtLink :to="`/${el.url}`">
                  <span class="absolute inset-0 z-10" />

                  <div class="size-2 bg-(--ui-success) rounded-full inline-block absolute top-4 right-4" />

                  <span class="font-medium">
                    {{ el.title }}
                  </span>
                </NuxtLink>

                <span class="text-sm text-(--ui-text-muted)">
                  {{ id }}
                </span>
              </div>
            </template>
          </UCard>
        </ul>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <USkeleton
            v-for="i in 5"
            :key="i"
            class="h-20 cursor-loading"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
