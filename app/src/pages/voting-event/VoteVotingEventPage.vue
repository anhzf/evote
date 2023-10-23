<script lang="ts" setup>
import { Votable, VoteToken, isTokenUsed } from '@anhzf/evote-shared/models';
import { useAsyncState, useEventBus } from '@vueuse/core';
import CardCandidate from 'components/CardCandidate.vue';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Dialog, Notify } from 'quasar';
import { useVotableList } from 'src/composables/use-votable';
import useVotingEvent from 'src/composables/use-voting-event';
import { getDb, getFns } from 'src/firebase';
import { showTheLoadingAndNotifyErrorAsync } from 'src/utils/ui';
import { onMounted, reactive, watch } from 'vue';
import { useCurrentUser } from 'vuefire';

const _ui = reactive({
  isLoading: true,
});

const authDialogBus = useEventBus<never>('show-auth-dialog');

const user = useCurrentUser();

const votingEvent = useVotingEvent();
const { state: userToken } = useAsyncState(async () => {
  if (!user.value) return undefined;

  if (!votingEvent.value) {
    throw new Error("Voting event doesn't exist.");
  }

  const docRef = doc(getDb(), 'VotingEvent', votingEvent.value?.uid, 'VoteToken', user.value.uid);
  const snapshot = await getDoc(docRef);

  return snapshot.exists() ? snapshot.data() as VoteToken : undefined;
}, undefined);

const votables = useVotableList();

const showShouldHaveTokenAlert = () => Notify.create({
  message: 'Anda harus memiliki token untuk memberi suara.',
  type: 'warning',
  position: 'bottom',
  multiLine: true,
  timeout: 30_000,
  progress: true,
  actions: [
    {
      label: 'Tutup', color: 'negative', handler: () => { /*  */ },
    },
    {
      label: 'Masukkan Token',
      handler: () => authDialogBus.emit(),
    },
  ],
});

const vote = async (voted: string) => {
  const fn = httpsCallable(getFns(), 'voteToken-use');
  const res = await fn({ id: voted });
  return res;
};

const onVote = (votable: Votable) => {
  if (!userToken.value || isTokenUsed(userToken.value)) {
    authDialogBus.emit();
    showShouldHaveTokenAlert();
  } else {
    Dialog.create({
      title: 'Konfirmasi',
      message: `Apakah anda yakin untuk memilih "${votable.title}"?`,
      cancel: true,
      persistent: true,
    })
      .onOk(() => showTheLoadingAndNotifyErrorAsync(async () => {
        await vote(votable.uid);

        Dialog.create({
          title: 'Terima kasih',
          message: 'Terima kasih telah memberikan suara anda. Silakan logout untuk mengakhiri sesi anda.',
          persistent: true,
          color: 'positive',
        });
      }));
  }
};

onMounted(async () => {
  if (!userToken.value) showShouldHaveTokenAlert();

  if (userToken.value && !isTokenUsed(userToken.value)) {
    Notify.create({
      message: 'Hak suara anda masih tersedia, silakan berikan suara kepada kandidat yang tersedia dengan bijak.',
      position: 'bottom',
      multiLine: true,
      timeout: 30_000,
      progress: true,
      actions: [
        { label: 'Tutup', handler: () => { /*  */ } },
        { label: 'Berikan suara', to: { name: 'VotingEvent-Vote' } },
      ],
    });
  }
});

watch(votables, (v, old) => {
  _ui.isLoading = (old === undefined && Array.isArray(v));
}, { immediate: true });
</script>

<template>
  <q-page
    padding
    class="column"
  >
    <section class="w-full max-w-6xl mx-auto row items-start q-col-gutter-lg">
      <template v-if="votables.length">
        <div
          v-for="el in votables"
          :key="el.uid"
          class="col-xs-12 col-sm-6 col-md-4"
        >
          <card-candidate
            :uid="el.uid"
            :title="el.title"
            :subtitle="el.subtitle"
            :img-src="el.thumbnailSrc"
            :desc="el.desc && JSON.parse(el.desc)"
            @vote="onVote(el)"
          />
        </div>
      </template>

      <p
        v-else
        class="self-stretch w-full text-center"
      >
        Tidak ada calon yang dapat dipilih.
      </p>
    </section>

    <q-inner-loading :showing="_ui.isLoading" />
  </q-page>
</template>
