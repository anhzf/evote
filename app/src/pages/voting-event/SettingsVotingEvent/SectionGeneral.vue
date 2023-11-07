<script lang="ts">
import { VotingEvent } from '@anhzf/evote-shared/models';
import { computedAsync, syncRefs, watchThrottled } from '@vueuse/core';
import config from 'src/config';
import { assetUrl } from 'src/utils/asset-url';
import {
  Ref,
  computed, inject, ref, toRaw, watch,
} from 'vue';
import { ref as storageRef, uploadBytes, updateMetadata } from 'firebase/storage';
import { getStorage } from 'src/firebase';
import { Loading } from 'quasar';

export interface Payload extends Pick<VotingEvent, 'title' | 'url'> {
  coverSrc: string | Blob;
}

interface Props {
  title: string;
  url?: string;
  coverSrc?: string | Blob;
}

interface Emits {
  (e: 'change', value: Payload): void;
  (e: 'reset'): void;
}

const uploadCover = async (votingEventId: string, file: File) => {
  const fileRef = storageRef(getStorage(), `VotingEvent/${votingEventId}/cover`);
  await uploadBytes(fileRef, file);
  await updateMetadata(fileRef, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
    },
  });
};
</script>

<script lang="ts" setup>
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const votingEvent = inject<Ref<VotingEvent>>('voting-event')!;

const defaultFields = computed<Payload>(() => ({
  title: props.title,
  url: props.url || '',
  coverSrc: props.coverSrc || 'https://picsum.photos/400/300',
}));

const fields = ref(toRaw(defaultFields.value));
syncRefs(defaultFields, fields);

const coverUrl = computedAsync(() => assetUrl(fields.value.coverSrc));
const finalUrl = computed(() => `${config.publicUrl}/${fields.value.url}`);

const onCoverChange = (e: Event) => {
  const elm = e.target as HTMLInputElement;

  if (elm.files?.[0]) {
    // eslint-disable-next-line prefer-destructuring
    fields.value.coverSrc = elm.files[0];
    Loading.show();
    uploadCover(votingEvent.value.uid, elm.files[0])
      .finally(() => Loading.hide());
  } else {
    elm.value = '';
  }
};

// TODO: Investigate the reactivity issue
watchThrottled(fields, (v) => {
  if (JSON.stringify(defaultFields.value) !== JSON.stringify(v)) {
    emit('change', v);
  } else {
    emit('reset');
  }
}, { throttle: 500 });
</script>

<template>
  <q-card-section>
    <q-list>
      <q-item-label header>
        Umum
      </q-item-label>

      <q-item>
        <q-item-section>
          <q-img
            :src="coverUrl"
            :ratio="16/9"
            class="group"
          >
            <div class="bottom-0 right-0 bg-transparent opacity-50 group-hover:opacity-100 transition-opacity">
              <q-btn
                label="Ganti gambar"
                icon="edit"
                color="white"
                text-color="primary"
              >
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png, image/webp"
                  class="opacity-0 absolute full cursor-pointer"
                  @change="onCoverChange"
                >
              </q-btn>
            </div>
          </q-img>
          <q-item-label caption>
            Gambar cover (rekomendasi rasio = 16:9)
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-input
            v-model="fields.title"
            label="Judul acara"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-input
            v-model="fields.url"
            label="Alamat URL"
            :hint="finalUrl"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>
