<template>
  <q-page>
    Vote: {{ votingName }}
  </q-page>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

const votingName = inject<string>('VotingEventName');
</script>