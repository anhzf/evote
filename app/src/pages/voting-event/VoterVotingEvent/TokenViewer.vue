<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { copyToClipboard, Notify } from 'quasar';
import { defineProps } from 'vue';
import VoteToken from 'src/actions/vote-token';
import useVotingEvent from 'src/composables/use-voting-event';

const props = defineProps<{
  voterId: string;
}>();

const votingEvent = useVotingEvent();
const {
  state: voteToken, isLoading, execute,
} = useAsyncState(
  () => VoteToken.get({ votingEventId: votingEvent.value!.uid, voterId: props.voterId }),
  undefined,
  { immediate: false },
);

const copyTokenToClipboard = async () => {
  await copyToClipboard(voteToken.value?.uid || '');
  Notify.create('Token telah dicopy ke clipboard');
};
</script>

<template>
  <!-- TODO: Change QPopupProxy to QInput -->
  <q-btn
    color="primary"
    label="Lihat Token"
    outline
    :loading="isLoading"
    @click="execute()"
  >
    <q-popup-proxy>
      <q-banner>
        <q-input
          :model-value="voteToken?.uid"
          readonly
          filled
          autofocus
          :loading="isLoading"
          class="select-all w-screen-xs"
          input-class="font-mono"
          hint="Token sudah digunakan"
          :disable="!!voteToken?.voted"
          :hide-hint="!voteToken?.voted"
        >
          <template #prepend>
            <q-btn
              icon="content_copy"
              flat
              round
              color="grey-6"
              @click="copyTokenToClipboard"
            />
          </template>
        </q-input>
      </q-banner>
    </q-popup-proxy>
  </q-btn>
</template>
