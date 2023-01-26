<script lang="ts" setup>
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS, Colors, Title, Tooltip, Legend, CategoryScale, ArcElement,
} from 'chart.js';
import { computed } from 'vue';

ChartJS.register(Title, Colors, Tooltip, Legend, CategoryScale, ArcElement);

interface Props {
  data: {
    label: string;
    data: number;
  }[]
}

const props = defineProps<Props>();

const labels = computed(() => props.data.map((d) => d.label));
const data = computed(() => props.data.map((d) => d.data));
</script>

<template>
  <Pie
    :options="{
      responsive: true,
      plugins: {
        colors: {
          forceOverride: true,
        },
        legend: {
          labels: {
            font: {
              size: 16,
            },
          }
        }
      }
    }"
    :data="{
      labels,
      datasets: [{
        data,
      }],
    }"
  />
</template>
