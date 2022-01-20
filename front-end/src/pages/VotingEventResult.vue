<template>
  <q-page
    padding
    class="column items-center"
  >
    <code
      class="debug"
      v-text="JSON.stringify(votingResult, null, 2)"
    />

    <q-card>
      <q-card-section>
        <div class="col text-center">
          Suara masuk: {{ votingResult.used }}
          <q-separator color="dark" />
          Suara terdaftar: {{ votingResult.total }}
        </div>
      </q-card-section>
    </q-card>

    <div class="q-mt-xl">
      <ResultChart :data="votingResult" />
    </div>

    <!-- <q-inner-loading :showing="isLoading" /> -->
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { VotingEvent } from '@evote/core';
import { useAsyncState } from '@vueuse/core';
import ResultChart from 'src/components/ResultChart.vue';
import { getVotingEventSummary } from 'src/modules/VotingEvent';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const { state: votingResult, isLoading } = useAsyncState(
  () => getVotingEventSummary(voting.value.id),
  { voteObjects: [], used: 0, total: 0 },
  { onError: console.error },
);
</script>

<style lang="sass">
.debug
  background-color: $blue-grey-1
  padding: 10px
  border-radius: 5px
  margin-bottom: 10px
  font-size: 12px
  color: #333
  white-space: pre
</style>
