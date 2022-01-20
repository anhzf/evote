<template>
  <canvas
    ref="resultChart"
    class="fit max-w-screen-xs"
    style="max-height: 70vh;"
  />
</template>

<script lang="ts" setup>
import {
  computed, defineProps, ref, watch, getCurrentInstance,
} from 'vue';
import { Chart, registerables } from 'chart.js';
import randomColor from 'randomcolor';
import { VoteObject } from '@evote/core';

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
const instance = getCurrentInstance();

const resultChart = ref<HTMLCanvasElement>();
const xValues = computed(() => props.data.voteObjects.map((el) => el.voteObject.title));
const yValues = computed(() => props.data.voteObjects.map((el) => el.count));

const chart = ref<Chart<'pie', number[], string>>();

watch([resultChart, xValues, yValues], () => {
  if (instance?.isMounted) {
    /* TODO: use chart.update() instead of re-render chart */
    if (resultChart.value) {
      Chart.register(...registerables);

      chart.value?.destroy();
      chart.value = new Chart(resultChart.value, {
        type: 'pie',
        data: {
          labels: xValues.value,
          datasets: [{
            backgroundColor: props.data.voteObjects.map(() => randomColor()),
            data: yValues.value,
          }],
        },
        options: {
          responsive: true,
        },
      });
    }
  }
}, { immediate: true });
</script>
