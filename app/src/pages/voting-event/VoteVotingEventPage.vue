<script lang="ts" setup>
import { Votable } from '@anhzf/evote-shared/models';
import CardCandidate from 'components/CardCandidate.vue';
import { httpsCallable } from 'firebase/functions';
import { Dialog, Notify } from 'quasar';
import { useVotableList } from 'src/composables/use-votable';
import { getFns } from 'src/firebase';
import { onMounted, reactive, watch } from 'vue';

const _ui = reactive({
  isLoading: true,
});
const votables = useVotableList();

const vote = async (voted: string) => {
  const fn = httpsCallable(getFns(), 'voteToken-use');
  const res = await fn({ id: voted });
  return res;
};

const onVote = (votable: Votable) => {
  Dialog.create({
    title: 'Konfirmasi',
    message: `Apakah anda yakin untuk memilih "${votable.title}"?`,
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      console.log(await vote(votable.uid));
    });
};

onMounted(async () => {
  Notify.create({
    message: 'Untuk memberi suara anda harus memiliki token atau login terlebih dahulu.',
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
      },
      {
        label: 'Login',
      },
    ],
  });
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
