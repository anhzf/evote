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
      <q-inner-loading :showing="isLoading" />
    </div>

    <div class="column items-stretch q-gutter-y-md">
      <q-btn
        label="Segarkan"
        icon="refresh"
        color="primary"
        @click="refresh"
      />

      <code
        class="debug flex-grow"
        v-text="JSON.stringify(readableVotingResult, null, 2)"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { inject, computed, Ref } from 'vue';
import { VotingEvent } from '@evote/core';
import { useAsyncState } from '@vueuse/core';
import ResultChart from 'src/components/ResultChart.vue';
import { getVotingEventSummary } from 'src/modules/VotingEvent';
import { getVoterListCount } from 'src/modules/Voter';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;

const getData = async () => {
  const summary = await getVotingEventSummary(voting.value.id);
  const voterCount = await getVoterListCount(voting.value.id);

  return {
    voteObjects: summary.voteObjects,
    used: summary.used,
    total: summary.total,
    voterCount,
  };
};
const { state: votingResult, isLoading, execute: refresh } = useAsyncState(
  getData,
  {
    voteObjects: [], used: 0, total: 0, voterCount: 0,
  },
  { onError: console.error },
);
const readableVotingResult = computed(() => ({
  'Suara digunakan': votingResult.value.used,
  'Jumlah pemilih terdaftar': votingResult.value.voterCount,
  // 'total suara': votingResult.value.total,
  ...votingResult.value.voteObjects.reduce(
    (acc, { voteObject, count }) => ({
      ...acc,
      [voteObject.title]: count,
    }),
    {},
  ),
}));
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
