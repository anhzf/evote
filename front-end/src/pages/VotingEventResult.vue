<template>
  <q-page>
    VotingEventResult: {{ voting }}
  </q-page>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { VotingEvent } from '@evote/core';

const voting = inject<VotingEvent>('VotingEvent');
</script>
