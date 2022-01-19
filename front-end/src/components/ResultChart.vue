<template>
  <div>
    <canvas
      id="myChart"
      style="width:auto; max-width:700px; max-height: 400px;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

const xValues = ['Sopan', 'Nasir kuning'];
const yValues = [102, 140];
const barColors = [
  '#2b5797',
  '#e8c3b9',
];

Chart.register(...registerables);

export default defineComponent({
  name: 'ResultChart',

  setup() {
    onMounted(() => {
      // eslint-disable-next-line no-new
      new Chart('myChart', {
        type: 'pie',
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues,
          }],
        },
        options: {},
      });
    });
  },
});

</script>
