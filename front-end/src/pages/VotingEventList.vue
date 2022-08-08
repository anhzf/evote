<template>
  <q-page
    padding
    class="row items-start"
  >
    <template v-if="votingEvents.length">
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
    </template>

    <div class="flex-grow column items-center q-gutter-y-lg q-py-xl">
      <q-icon
        name="sentiment_very_satisfied"
        size="10rem"
        color="green-13"
      />

      <span class="text-h6 text-center q-mb-lg">Anda tidak memiliki acara</span>

      <q-btn
        label="Buat acara"
        :to="{ name: 'VotingEventCreate' }"
        color="primary"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { useUser } from 'src/use/useUser';
import { getUserVotingEvents } from 'src/modules/VotingEvent';

useUser('auth');

const { state: votingEvents } = useAsyncState(getUserVotingEvents(), []);
</script>
