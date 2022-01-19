<template>
  <q-page
    padding
    class="row items-start q-col-gutter-lg"
  >
    <div
      v-for="(el, i) in voteObjects"
      :key="el.id"
      class="col-xs-12 col-sm-4"
    >
      <q-card
        class="vote-obj-card cursor-pointer"
        @click="openDialog(el)"
      >
        <q-img
          :src="voteObjectsThumbnails[i]"
          :ratio="4/3"
        />

        <q-card-section class="column">
          <span class="text-body1 text-center">{{ el.title }}</span>
          <span class="text-caption text-center">{{ el.subtitle }}</span>
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="isLoading" />
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { Dialog, Notify } from 'quasar';
import { VoteObject, VotingEvent } from '@evote/core';
import DialogVoteObjectDetail from 'src/components/DialogVoteObjectDetail.vue';
import { asyncComputed, useAsyncState } from '@vueuse/core';
import { getVoteObjects, getVoteObjectThumbnailUrl } from 'src/modules/VoteObject';
import { getUserVoteToken, vote } from 'src/modules/VoteToken';
import { promiseHandler } from 'src/utils/ui';
import { useUser } from 'src/use/useUser';

useUser('auth');

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;

const { state: voteObjects, isLoading } = useAsyncState(
  () => getVoteObjects(voting.value.id),
  [],
);
const voteObjectsThumbnails = asyncComputed(
  () => Promise.all(voteObjects.value.map((el) => getVoteObjectThumbnailUrl(voting.value.id, el.id))),
  [],
);

const openDialog = (voteObject: VoteObject) => {
  Dialog.create({
    component: DialogVoteObjectDetail,
    componentProps: { data: voteObject },
  })
    .onOk((async () => {
      const userVoteToken = await getUserVoteToken();
      void promiseHandler(vote(voting.value.id, userVoteToken?.id || '', voteObject.id)
        .then(() => Notify.create({ message: 'Berhasil memilih!', type: 'positive' })));
    }) as () => void);
};
</script>

<style lang="sass">
.vote-obj-card
  &:hover
    background-color: $blue-grey-1
</style>
