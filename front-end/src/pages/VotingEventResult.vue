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
          Suara masuk: {{ totalCount }}
          <q-separator color="dark" />
          Suara terdaftar: {{ NaN }}
        </div>
      </q-card-section>
    </q-card>

    <div class="q-mt-xl">
      <ResultChart :data="votingResult" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { inject, computed, Ref } from 'vue';
import { VotingEvent } from '@evote/core';
import { useAsyncState } from '@vueuse/core';
import ResultChart from 'src/components/ResultChart.vue';
import { getVotingEventSummary } from 'src/modules/VotingEvent';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const { state: votingResult } = useAsyncState(
  () => getVotingEventSummary(voting.value.id), [],
  { onError: console.error },
);
const totalCount = computed(() => votingResult.value.reduce((acc, cur) => acc + cur.count, 0));
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
