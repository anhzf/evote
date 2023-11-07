<script lang="ts" setup>
import { getStorage, ref } from 'firebase/storage';
import { assetUrl } from 'src/utils/asset-url';
import { Ref, inject } from 'vue';
import { VotingEvent } from '~/packages/shared/models';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const votingEvent = inject<Ref<VotingEvent>>('voting-event')!;
const coverUrl = await assetUrl(ref(getStorage(), `VotingEvent/${votingEvent.value.uid}/cover`).toString());
</script>

<template>
  <q-page
    padding
    class="column mx-a max-w-screen-lg"
  >
    <q-img
      :src="coverUrl"
      :ratio="16/9"
      fit="scale-down"
    />

    <section class="column">
      <h2 class="text-caption text-grey-10">
        Media sosial dan Kontak
      </h2>

      <ul class="list-none m-0 p-0 flex gap-4">
        <li>
          <q-btn
            label="smpn23surakarta.sch.id"
            icon="mdi-web"
            flat
            href="https://smpn23surakarta.sch.id/"
            target="_blank"
          />
        </li>
        <li>
          <q-btn
            label="SMP Negeri 23 Surakarta Official"
            icon="mdi-youtube"
            flat
            href="https://www.youtube.com/@smpnegeri23surakartaoffici12"
            target="_blank"
          />
        </li>
        <li>
          <q-btn
            label="SMPN 23 Surakarta"
            icon="mdi-facebook"
            flat
            href="https://facebook.com/smpnegeri23surakarta/"
            target="_blank"
          />
        </li>
        <li>
          <q-btn
            label="@smpnegeri23surakarta_official"
            icon="mdi-instagram"
            flat
            href="https://www.instagram.com/smpnegeri23surakarta_official/"
            target="_blank"
          />
        </li>
      </ul>
    </section>
  </q-page>
</template>
