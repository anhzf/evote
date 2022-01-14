<template>
  <router-view />
</template>

<script lang="ts" setup>
import { ref, provide, Ref } from 'vue';
import { VotingEvent } from '@evote/core';
import { useRoute } from 'vue-router';

const route = useRoute();
const votingEvent = ref(new VotingEvent({
  title: String(route.params.votingEventName),
})) as Ref<VotingEvent>;

provide('VotingEventName', votingEvent);
</script>
