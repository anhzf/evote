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
const resultCount = asyncComputed(() => Promise.all(votables.value.map(async (votable) => {
  const votableRef = doc(getDb(), 'VotingEvent', votingEvent.value.uid, 'Votable', votable.uid);
  const voteTokenCollection = collection(getDb(), 'VotingEvent', votingEvent.value.uid, 'VoteToken');
  const q = query(
    voteTokenCollection,
    where('voted', '==', votableRef),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
})), []);
const chartData = computed(() => votables.value.map((el, i) => ({
  label: String(el.title),
  data: resultCount.value[i],
})));
</script>

<template>
  <q-page padding>
    <div class="flex justify-evenly max-h-80vh">
      <ResultPieChart :data="chartData" />

      <div class="flex flex-col justify-center gap-4">
        <div
          v-for="(votable, i) in votables"
          :key="votable.uid"
          class="flex items-center"
        >
          <q-icon
            :name="votable.icon"
            size="2rem"
          />
          <div class="flex flex-col ml-2">
            <div class="text-h6">
              {{ votable.title }}
            </div>
            <div class="text-h1 text-secondary">
              {{ resultCount[i] }} ({{ (resultCount[i] / resultCount.reduce((a, b) => a + b, 0) * 100).toFixed(2) }}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
