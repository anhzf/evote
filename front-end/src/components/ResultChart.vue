<template>
  <div>
    <canvas
      id="myChart"
      style="width:auto; max-width:700px; max-height: 400px;"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  inject, onMounted, computed, defineProps, ref, Ref, watch,
} from 'vue';
import { Chart, registerables } from 'chart.js';
import { VoteObject, VotingEvent } from '@evote/core';

interface Props {
  data: {
    voteObject: VoteObject,
    count: number;
  }[];
}

const props = defineProps<Props>();
// const voting = inject<Ref<VotingEvent>>('VotingEvent')!;

const xValues = computed(() => props.data.map(({ voteObject }) => voteObject.title));
const yValues = computed(() => props.data.map((el) => el.count));
const barColors = [
  '#2b5797',
  '#e8c3b9',
];
const chart = ref<Chart<'pie', number[], string>>();

onMounted(() => {
  Chart.register(...registerables);

  chart.value = new Chart('myChart', {
    type: 'pie',
    data: {
      labels: xValues.value,
      datasets: [{
        backgroundColor: barColors,
        data: yValues.value,
      }],
    },
    options: {},
  });
});

const updateDatasets = () => {
  if (chart.value) {
    chart.value.data.datasets[0].data = yValues.value;
    chart.value.update();
  }
};

watch([xValues, yValues], () => {
  updateDatasets();
});
</script>
