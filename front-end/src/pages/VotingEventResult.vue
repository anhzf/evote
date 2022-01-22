<template>
  <q-page
    padding
    class="row justify-around items-stretch full-width no-wrap"
  >
    <div
      class="relative-position fit flex-shrink column justify-center items-center q-py-lg"
      style="min-height: 80vh;"
    >
      <ResultChart :data="votingResult" />
      <q-inner-loading :showing="UIState.isLoading" />
    </div>

    <div class="column items-stretch q-gutter-y-md">
      <code
        class="debug flex-grow"
        v-text="JSON.stringify(readableVotingResult, null, 2)"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import {
  inject, reactive, shallowRef, computed, Ref, onUnmounted, watch,
} from 'vue';
import { Unsubscribe } from 'firebase/firestore';
import { VoteObject, VotingEvent } from '@evote/core';
import ResultChart from 'src/components/ResultChart.vue';
import { listenVotingEventSummary } from 'src/modules/VotingEvent';
import { getVoterListCount } from 'src/modules/Voter';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const UIState = reactive({
  isLoading: false,
});
const votingResult = shallowRef({
  used: 0,
  total: 0,
  voteObjects: [] as { voteObject: VoteObject; count: number; }[],
  voterCount: 0,
});
const readableVotingResult = computed(() => ({
  'Suara digunakan': votingResult.value.used,
  'Jumlah pemilih terdaftar': votingResult.value.voterCount,
  'Total suara': votingResult.value.total,
  ...votingResult.value.voteObjects.reduce(
    (acc, { voteObject, count }) => ({
      ...acc,
      [voteObject.title]: count,
    }),
    {},
  ),
}));

let unsubscribe: Unsubscribe;

onUnmounted(() => unsubscribe?.());

watch(voting, (v) => {
  UIState.isLoading = true;
  unsubscribe?.();
  unsubscribe = listenVotingEventSummary(v.id, (data) => {
    getVoterListCount(v.id)
      .then((voterCount) => {
        votingResult.value = {
          ...data,
          voterCount,
        };
        UIState.isLoading = false;
      })
      .catch(console.error);
  }, console.error);
}, { immediate: true });

</script>

<style lang="sass" scoped>
.q-page
  @media screen and (max-width: $breakpoint-sm)
    flex-direction: column

.debug
  min-width: 60ch
  background-color: $blue-grey-1
  padding: 10px
  border-radius: 5px
  margin-bottom: 10px
  font-size: 12px
  color: #333
  white-space: pre
</style>
