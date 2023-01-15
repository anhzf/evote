<script lang="ts" setup>
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, ArcElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, ArcElement);
</script>

<template>
  <Pie
    :options="{
      responsive: true,
    }"
    :data="{
      labels: ['M. Abdul Aziz', 'N. Abdul Aziz', 'O. Abdul Aziz'],
      datasets: [{
        data: [1231,432, 123],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
      }]
    }"
  />
</template>
