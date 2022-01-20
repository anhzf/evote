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
  onMounted, computed, defineProps, ref, Ref, watch,
} from 'vue';
import { Chart, registerables } from 'chart.js';
import { VoteObject, VotingEvent } from '@evote/core';

interface Props {
  data: {
    voteObjects: {
      voteObject: VoteObject;
      count: number;
    }[],
    used: number;
    total: number;
  };
}

const props = defineProps<Props>();

const xValues = computed(() => props.data.voteObjects.map((el) => el.voteObject.title));
const yValues = computed(() => props.data.voteObjects.map((el) => el.count));
// const data = [10];
// const yValues = computed(() => data);
const barColors = [
  '#2b5797',
  '#e8c3b9',
];
// const chart = ref<Chart<'pie', number[], string>>();

// console.log(yValues.value);

onMounted(() => {
  Chart.register(...registerables);

  // eslint-disable-next-line no-new
  new Chart('myChart', {
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

// const updateDatasets = () => {
//   if (chart.value) {
//     chart.value.data.datasets[0].data = yValues.value;
//     chart.value.update();
//   }
// };

// watch([xValues, yValues], () => {
//   updateDatasets();
// });
</script>
