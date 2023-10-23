<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { copyToClipboard, Notify } from 'quasar';
import VoteToken from 'src/actions/vote-token';
import useVotingEvent from 'src/composables/use-voting-event';

interface Props {
  voterId: string;
  showToken?: boolean;
}

interface Emits {
  (e: 'viewToken'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const votingEvent = useVotingEvent();
const {
  state: voteToken, isLoading, execute: fetchToken,
} = useAsyncState(
  () => VoteToken.get({ votingEventId: votingEvent.value!.uid, voterId: props.voterId }),
  undefined,
  { immediate: false },
);

const requestToken = async () => {
  await fetchToken();
  emits('viewToken');
};

const copyTokenToClipboard = async () => {
  await fetchToken();
  await copyToClipboard(voteToken.value?.uid || '');
  Notify.create('Token telah dicopy ke clipboard');
};
</script>

<template>
  <q-input
    :model-value="voteToken?.uid || '*******'"
    :type="showToken ? 'text' : 'password'"
    filled
    dense
    readonly
    :loading="isLoading"
    hint="Token sudah digunakan"
    :hide-hint="!voteToken?.voted"
    input-class="font-mono font-semibold"
    autocomplete="off"
    class="w-30ch primary"
  >
    <template #append>
      <q-btn
        :icon="showToken ? 'visibility_off' : 'visibility'"
        flat
        round
        color="grey-6"
        @click="requestToken"
      />
      <q-btn
        icon="content_copy"
        flat
        round
        color="grey-6"
        @click="copyTokenToClipboard"
      />
    </template>
  </q-input>
</template>
