<template>
  <q-page padding>
    VotingEventResult: {{ voting }}
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { VotingEvent } from '@evote/core';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
</script>
