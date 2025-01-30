<script lang="ts" setup>
import {
  computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TabAccess from './TabAccess.vue';
import TabCandidates from './TabCandidates.vue';
import TabGeneral from './TabGeneral.vue';

const router = useRouter();
const route = useRoute();

const tab = computed({
  get: () => route.query.tab as string || 'general',
  set: (v) => router.replace({ query: { tab: v } }),
});

const onNeedRefresh = async (name: string) => {
  await router.replace({ query: { tab: '$temp' } });
  tab.value = name;
};
</script>

<template>
  <q-page
    padding
    class="column items-center"
  >
    <q-card class="w-full max-w-3xl min-h-60vh flex">
      <q-tabs
        v-model="tab"
        vertical
        inline-label
        class="text-secondary min-w-36"
      >
        <q-route-tab
          :to="{ query: {tab: 'general'} }"
          name="general"
          icon="info"
          label="General"
        />
        <q-route-tab
          :to="{ query: {tab: 'candidate'} }"
          name="candidate"
          icon="group"
          label="Kandidat"
        />
        <q-route-tab
          :to="{ query: {tab: 'access'} }"
          name="access"
          icon="lock"
          label="Akses"
        />
      </q-tabs>

      <q-separator vertical />

      <q-tab-panels
        v-model="tab"
        vertical
        class="flex-grow-1"
      >
        <q-tab-panel name="general">
          <tab-general
            flat
            class="p-0"
            @need-refresh="onNeedRefresh('general')"
          />
        </q-tab-panel>

        <q-tab-panel name="candidate">
          <tab-candidates
            flat
            class="p-0"
            @need-refresh="onNeedRefresh('candidate')"
          />
        </q-tab-panel>

        <q-tab-panel name="access">
          <tab-access
            flat
            class="p-0"
            @need-refresh="onNeedRefresh('access')"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
