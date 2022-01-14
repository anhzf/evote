<template>
  <q-page
    padding
    class="column items-stretch q-gutter-y-lg"
  >
    <div class="row justify-between no-wrap q-gutter-x-md">
      <h1 class="text-h2 q-my-auto">
        {{ voting?.title }}
      </h1>

      <div class="col-shrink-0 column justify-start items-end q-gutter-y-md">
        <q-btn
          label="Berikan suara"
          icon="how_to_vote"
          color="primary"
          :to="{ name: 'VotingEvent_Vote', params: { id: voting?.id } }"
        />

        <q-btn
          label="Lihat perolehan"
          icon="poll"
          outline
          color="primary"
          :to="{ name: 'VotingEvent_Result', params: { id: voting?.id } }"
        />
      </div>
    </div>

    <q-img
      src="https://placeimg.com/500/300/nature"
      :ratio="16/9"
      class="self-center max-w-screen-sm bg-grey-3"
    />

    <q-markdown
      :src="desc"
      no-html
      class="self-center full-width max-w-screen-sm"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { VotingEvent } from '@evote/core';

const voting = inject<VotingEvent>('VotingEvent');
const desc = `
:::
**Pemilihan Presiden OSIS**
Pemilu OSIS yang diadakan oleh SMPN 23 ini...
:::
`;
</script>
