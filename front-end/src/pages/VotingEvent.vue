<template>
  <q-page
    padding
    class="column items-stretch q-gutter-y-lg"
  >
    <div class="row justify-between no-wrap q-gutter-x-md">
      <h1 class="text-h2 q-my-auto">
        {{ voting.title }}
      </h1>

      <div class="flex-shrink-0 column justify-start items-end q-gutter-y-md">
        <q-btn
          label="Berikan suara"
          icon="how_to_vote"
          color="primary"
          :disable="voting.isClosed"
          @click="onClickVoteNow"
        />

        <q-btn
          v-if="voting.isResultsPublished"
          label="Lihat perolehan"
          icon="poll"
          outline
          color="primary"
          :to="{ name: 'VotingEvent_Result', params: { id: voting.id } }"
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
import { inject, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog } from 'quasar';
import { VotingEvent } from '@evote/core';
import DialogEnterVote from 'src/components/DialogEnterVote.vue';
import { useUser } from 'src/use/useUser';
import { useAuthModule } from 'src/modules/Auth';
import { promiseHandler } from 'src/utils/ui';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const router = useRouter();
const user = useUser();
const { loginWithVoteToken } = useAuthModule();

const desc = `
:::
**Pemilihan Presiden OSIS**
Pemilu OSIS yang diadakan oleh SMPN 23 ini...
:::
`;

const gotoVotePage = () => promiseHandler(router.push({ name: 'VotingEvent_Vote', params: { id: voting.value.id } }));

const onClickVoteNow = () => {
  if (user.value) {
    void gotoVotePage();
  } else {
    Dialog.create({ component: DialogEnterVote })
      .onOk((token: string) => {
        void promiseHandler(loginWithVoteToken(voting.value.id, token));
        void gotoVotePage();
      });
  }
};
</script>
