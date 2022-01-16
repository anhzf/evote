<template>
  <q-page
    padding
    class="row items-start q-col-gutter-lg"
  >
    <div
      v-for="el in voteObjects"
      :key="el.id"
      class="col-4"
    >
      <q-card
        class="vote-obj-card cursor-pointer"
        @click="openDialog(el)"
      >
        <q-img
          :src="`https://i.pravatar.cc/200?u=${el.title}`"
          :ratio="4/3"
        />

        <q-card-section class="column">
          <span class="text-body1 text-center">{{ el.title }}</span>
          <span class="text-caption text-center">{{ el.subtitle }}</span>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import {
  ref, inject, Ref, watch,
} from 'vue';
import { VoteObject, VotingEvent } from '@evote/core';
import { Dialog } from 'quasar';
import DialogVoteObjectDetail from 'src/components/DialogVoteObjectDetail.vue';
import { useUser } from 'src/use/useUser';

const voting = inject<VotingEvent>('VotingEvent');
const voteObjects = ref([
  new VoteObject().fill({
    title: 'Shoffan Mujahid',
    subtitle: 'XII IPS 1',
  }),
  new VoteObject().fill({
    title: 'M. Nashiruddin',
    subtitle: 'XII IPA 2',
  }),
  new VoteObject().fill({
    title: 'Fahri Hidayat',
    subtitle: 'XII IPA 2',
  }),
]) as Ref<VoteObject[]>;

const user = useUser('auth');

const openDialog = (voteObject: VoteObject) => {
  Dialog.create({
    component: DialogVoteObjectDetail,
    componentProps: {
      data: voteObject,
    },
  });
};

watch(user, () => {
  console.log(user.value);
});
</script>

<style lang="sass">
.vote-obj-card
  &:hover
    background-color: $blue-grey-1
</style>
