<template>
  <q-page
    padding
    class="row items-start"
  >
    <q-card
      v-for="el in votingEvents"
      :key="el.id"
      class="col-xs-12 col-sm-4"
    >
      <q-card-section>
        {{ el.title }}
      </q-card-section>

      <q-card-actions>
        <q-btn
          label="Lihat"
          :to="{ name: 'VotingEvent', params: { votingEventName: el.url } }"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { getUserVotingEvents } from 'src/modules/VotingEvent';
import { useUser } from 'src/use/useUser';

useUser('auth');

const { state: votingEvents } = useAsyncState(getUserVotingEvents(), []);
</script>
