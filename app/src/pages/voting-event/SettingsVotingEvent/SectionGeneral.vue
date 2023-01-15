<script lang="ts" setup>
import { VotingEvent } from '@anhzf/evote-shared/models';
import { computedAsync } from '@vueuse/core';
import { computed, reactive } from 'vue';
import { assetUrl } from 'src/utils/asset-url';
import config from 'src/config';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
    default: '',
  },
  coverSrc: {
    type: [String, Blob],
    required: false,
    default: 'http://picsum.photos/800/400',
  },
});

const fields = reactive({
  ...<Pick<VotingEvent, 'title' | 'url'>>{
    title: props.title,
    url: props.url,
  },
  coverSrc: props.coverSrc as string | File,
});

const coverUrl = computedAsync(() => assetUrl(fields.coverSrc));
const finalUrl = computed(() => `${config.publicUrl}/${fields.url}`);

const onCoverChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    fields.coverSrc = file;
  }
};
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
