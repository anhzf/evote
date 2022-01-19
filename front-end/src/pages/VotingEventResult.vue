<template>
  <q-page padding>
    <!-- VotingEventResult: {{ voting }} -->
    <q-card class="my-card">
      <q-card-section>
        <div class="col text-center">
          {{ up }}
          <q-separator color="dark" />
          {{ down }}
        </div>
      </q-card-section>
    </q-card>
    <div class="q-mt-xl">
      <result-chart />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { VotingEvent } from '@evote/core';
import ResultChart from 'src/components/ResultChart.vue';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const up = 900;
const down = 1000;

</script>

<style lang="sass">
  .my-card
    width: 100%
    max-width: 80px
</style>
