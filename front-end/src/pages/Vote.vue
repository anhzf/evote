<template>
  <q-page
    padding
    class="row items-start q-col-gutter-lg"
  >
    <div
      v-for="el in voteObjects"
      :key="el.data.id"
      class="col-xs-12 col-sm-4"
    >
      <q-card
        class="vote-obj-card cursor-pointer"
        @click="openDialog(el.data, el.img)"
      >
        <q-img
          :src="el.img"
          :ratio="4/3"
        />

        <q-card-section class="column">
          <span class="text-body1 text-center">{{ el.data.title }}</span>
          <span class="text-caption text-center">{{ el.data.subtitle }}</span>
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="isLoading" />
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, Notify } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import DialogVoteObjectDetail from 'src/components/DialogVoteObjectDetail.vue';
import { useUser } from 'src/use/useUser';
import { getVoteObjects } from 'src/modules/VoteObject';
import { getUserVoteToken, vote } from 'src/modules/VoteToken';
import { VoteObject, VotingEvent } from '~/shared/core';

useUser('auth');

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const router = useRouter();

const { state: voteObjects, isLoading } = useAsyncState(
  () => getVoteObjects(voting.value.id),
  [],
  { onError: console.error },
);

const openDialog = (voteObject: VoteObject, imgSrc: string) => {
  Dialog.create({
    component: DialogVoteObjectDetail,
    componentProps: { data: voteObject, imgSrc, votingId: voting.value.id },
  })
    .onOk((async () => {
      isLoading.value = true;
      try {
        const userVoteToken = await getUserVoteToken();

        await vote(voting.value.id, userVoteToken?.id || '', voteObject.id);
        Notify.create({ message: 'Berhasil memilih!', type: 'positive', timeout: 10_000 });
        await router.push({ name: 'VotingEvent_VoteFinish' });
      } catch (err) {
        Notify.create({ message: String(err), type: 'negative', timeout: 10_000 });
      }
      isLoading.value = false;
    }) as () => void);
};
</script>

<style lang="sass">
.vote-obj-card
  &:hover
    background-color: $blue-grey-1
</style>
