<template>
  <q-page padding>
    <div class="column items-stretch fit max-w-screen-xs q-mx-auto">
      <h6 class="q-mt-md q-mb-lg">
        Pengaturan
      </h6>

      <q-card class="flex-grow">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Reset pemilihan</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                label="Reset"
                push
                color="red"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <q-inner-loading :showing="isUserPrivilegeLoading" />
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { VotingEvent } from '@evote/core';
import { useUserPrivilege } from 'src/use/useUserPrivilege';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;

const router = useRouter();

const { isLoading: isUserPrivilegeLoading, is } = useUserPrivilege(
  voting.value,
  () => is('OWNER') || is('ADMIN'),
  () => router.push({ name: 'VotingEvent', params: { votingEventName: voting.value.url } }),
);
</script>
