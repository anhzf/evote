<template>
  <q-btn
    color="primary"
    label="Lihat Token"
    outline
    :loading="isLoading"
    @click="execute"
  >
    <q-popup-proxy>
      <q-banner>
        <template #avatar>
          <q-btn
            icon="content_copy"
            flat
            round
            color="grey-6"
            @click="copyTokenToClipboard"
          />
        </template>

        <span class="select-all w-screen-xs">{{ voteToken?.id }}</span>
      </q-banner>
    </q-popup-proxy>
  </q-btn>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { copyToClipboard, Notify } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { getVoteToken } from 'src/modules/VoteToken';

const props = defineProps<{
  votingEventId: string;
  voterId: string;
}>();

const {
  state: voteToken, isLoading, execute,
} = useAsyncState(
  () => getVoteToken(props.votingEventId, props.voterId),
  undefined,
  { immediate: false },
);

const copyTokenToClipboard = async () => {
  await copyToClipboard(voteToken.value?.id || '');
  Notify.create('Token telah dicopy ke clipboard');
};
</script>
