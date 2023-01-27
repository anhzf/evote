<script lang="ts" setup>
import { asyncComputed } from '@vueuse/core';
import ResultPieChart from 'components/VotingEventResult/ResultPieChart.vue';
import {
  collection, doc, getCountFromServer, query, where,
} from 'firebase/firestore';
import { useVotableList } from 'src/composables/use-votable';
import useVotingEvent from 'src/composables/use-voting-event';
import { getDb } from 'src/firebase';
import { computed } from 'vue';

const votingEvent = useVotingEvent();
const votables = useVotableList();
const resultCount = asyncComputed(() => Promise.all([
  ...votables.value.map(async (votable) => {
    const votableRef = doc(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Votable', votable.uid);
    const voteTokenCollection = collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'VoteToken');
    const q = query(
      voteTokenCollection,
      where('voted', '==', votableRef),
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }),
  (async () => {
    const voterCollection = collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Voter');
    const snapshot = await getCountFromServer(voterCollection);
    return snapshot.data().count;
  })(),
]), <number[]>[]);

const resultPerVotables = computed(() => resultCount.value.slice(0, votables.value.length));
const resultTotal = computed(() => resultCount.value.at(-1)!);
const resultUsed = computed(() => resultPerVotables.value.reduce((a, b) => a + b, 0));

const chartData = computed(() => votables.value.map((el, i) => ({
  label: String(el.title),
  data: resultPerVotables.value.at(i)!,
})));
</script>

<template>
  <q-page padding>
    <div class="flex flex-nowrap justify-evenly max-h-[80vh]">
      <ResultPieChart
        :data="chartData"
        class="w-2/3"
      />

      <div class="w-1/3 flex flex-col justify-center gap-4">
        <div
          v-for="(votable, i) in votables"
          :key="votable.uid"
          class="flex items-center"
        >
          <div class="flex flex-col ml-2">
            <div class="text-h6">
              {{ votable.title }}
            </div>
            <div class="text-h1 text-secondary">
              {{ resultPerVotables.at(i) }} ({{ (resultPerVotables.at(i)! / resultUsed * 100).toFixed(2) }}%)
            </div>
          </div>
        </div>
        <q-separator />
        <div class="flex items-center">
          <div class="flex flex-col ml-2">
            <div class="text-h6">
              Total suara masuk
            </div>
            <div>
              <span class="text-h1 text-accent">
                {{ resultUsed }}
              </span>
              <span class="text-h4 text-gray">
                /{{ resultTotal }}
              </span>
              <span class="text-h4 text-secondary">
                ({{ (resultUsed * 100 / resultTotal).toFixed(2) }})%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
