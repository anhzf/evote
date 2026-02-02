<script lang="ts" setup>
import DefineState from 'components/DefineState.vue';
import { FirebaseError } from 'firebase/app';
import { getStorage, ref } from 'firebase/storage';
import { Notify } from 'quasar';
import { SOCIAL_PLATFORMS } from 'src/constants';
import { assetUrl } from 'src/utils/asset-url';
import { Ref, inject } from 'vue';
import { VotingEvent } from '~/packages/shared/models';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const votingEvent = inject<Ref<VotingEvent>>('voting-event')!;
const coverUrl = await assetUrl(ref(getStorage(), `VotingEvent/${votingEvent.value.uid}/cover`).toString())
  .catch((err) => {
    if (!(err instanceof FirebaseError
      && err.code === 'storage/object-not-found')) {
      Notify.create({
        message: `Gagal memuat gambar sampul: ${err.message}`,
        type: 'negative',
        position: 'bottom',
      });
    }

    return 'https://placehold.co/200x150?text=No+cover+image';
  });
</script>

<template>
  <q-page
    padding
    class="column mx-a max-w-screen-lg"
  >
    <q-img
      :src="coverUrl"
      :ratio="16/9"
      fit="cover"
    />

    <section
      v-if="votingEvent.socials?.length"
      class="column"
    >
      <h2 class="text-caption text-grey-10">
        Media sosial dan Kontak
      </h2>

      <ul class="list-none m-0 p-0 flex gap-4">
        <li
          v-for="(social, i) in votingEvent.socials"
          :key="i"
        >
          <DefineState
            :value="SOCIAL_PLATFORMS[social.type as keyof typeof SOCIAL_PLATFORMS]"
            #="{state: [platform]}"
          >
            <q-btn
              :label="social.label"
              :icon="platform?.icon"
              flat
              :href="platform?.getUrl(social.url)"
              target="_blank"
            />
          </DefineState>
        </li>
      </ul>
    </section>
  </q-page>
</template>
