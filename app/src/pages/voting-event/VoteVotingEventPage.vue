<script lang="ts" setup>
import { Votable } from '@anhzf/evote-shared/models';
import { onMounted, ref } from 'vue';
import { Notify, uid } from 'quasar';

const votables = ref<Votable[]>([
  {
    uid: uid(),
    title: 'M. Abdul Aziz',
    subtitle: 'VIII A',
    thumbnailSrc: '/assets/mockup/calon1.png',
    createdAt: new Date(),
  },
  {
    uid: uid(),
    title: 'M. Abdul Aziz',
    subtitle: 'VIII A',
    thumbnailSrc: '/assets/mockup/calon2.png',
    createdAt: new Date(),
  },
  {
    uid: uid(),
    title: 'M. Abdul Aziz',
    subtitle: 'VIII A',
    thumbnailSrc: '/assets/mockup/calon3.png',
    createdAt: new Date(),
  },
]);

const vote = (votable: Votable) => {
  console.log(votable);
};

onMounted(() => {
  Notify.create({
    message: 'Untuk memberi suara anda harus memiliki token atau login terlebih dahulu.',
    type: 'warning',
    position: 'bottom',
    multiLine: true,
    timeout: 0,
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
    timeout: 0,
    actions: [
      { label: 'Tutup', handler: () => { /*  */ } },
      { label: 'Berikan suara', to: { name: 'VotingEvent-Vote' } },
    ],
  });
});
</script>

<template>
  <q-page
    padding
    class="column"
  >
    <section class="w-full max-w-6xl mx-auto row items-start q-col-gutter-lg">
      <div
        v-for="el in votables"
        :key="el.uid"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card @click="vote(el)">
          <q-img
            :src="el.thumbnailSrc"
            :ratio="4/3"
          />

          <q-card-section class="column">
            <h3 class="text-h6 m-0 text-center">
              {{ el.title }}
            </h3>
            <p class="text-caption m-0 text-center">
              {{ el.subtitle }}
            </p>
          </q-card-section>

          <q-card-actions vertical>
            <q-btn
              label="Pilih"
              color="primary"
            />
          </q-card-actions>
        </q-card>
      </div>
    </section>
  </q-page>
</template>
