<template>
  <q-page padding>
    VotingEventVoterList: {{ voting }}

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
