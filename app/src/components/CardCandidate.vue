<script lang="ts" setup>
import { singleton } from '@anhzf/evote-shared/utils';
import { asyncComputed, useAsyncState, watchOnce } from '@vueuse/core';
import markdownIt from 'markdown-it';
import { assetUrl } from 'src/utils/asset-url';
import { ref } from 'vue';

interface Props {
  uid: string;
  title: string;
  subtitle: string;
  imgSrc?: string;
  desc?: string;
}

interface Emits {
  (e: 'vote'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const imgUrl = asyncComputed(() => assetUrl(props.imgSrc));
const showDialog = ref(false);

const { state: renderedDesc, execute: prepareDesc } = useAsyncState(singleton(() => new Promise((resolve) => {
  const md = markdownIt();
  resolve(md.render(props.desc!));
})), '');

watchOnce(() => showDialog.value === true, () => {
  prepareDesc();
});
</script>

<template>
  <q-card>
    <q-img
      :src="imgUrl"
      :ratio="4/3"
    />

    <q-card-section class="column">
      <h3 class="text-h6 m-0 text-center">
        {{ title }}
      </h3>
      <p class="text-caption m-0 text-center">
        {{ subtitle }}
      </p>
    </q-card-section>

    <q-card-actions vertical>
      <q-btn
        label="Lihat visi misi"
        color="secondary"
        @click="showDialog = true"
      />
      <q-btn
        label="Pilih"
        color="primary"
        @click="$emit('vote')"
      />
    </q-card-actions>
  </q-card>

  <q-dialog
    v-model="showDialog"
    full-height
  >
    <q-card class="q-dialog-plugin column no-wrap w-full max-w-screen-sm">
      <q-card-section class="row justify-between items-start no-wrap">
        <h6
          class="q-my-none"
          style="text-wrap: balance"
        >
          {{ title }}
        </h6>

        <q-btn
          v-close-popup
          icon="close"
          flat
          round
          color="grey-5"
        />
      </q-card-section>

      <q-card-section class="column no-wrap scroll grow">
        <q-img
          :src="imgUrl"
          class="flex-shrink-0 self-center w-full max-w-screen-xs"
        />

        <div
          v-html="renderedDesc"
          class="prose"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          v-close-popup
          label="Pilih"
          color="primary"
          class="full-width"
          @click="$emit('vote')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
