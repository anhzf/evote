<script lang="ts" setup>
import { ref as storageRef } from 'firebase/storage';
import useVotingEvent from 'src/composables/use-voting-event';
import { getStorage } from 'src/firebase';
import { assetUrl } from 'src/utils/asset-url';
import { reactive } from 'vue';
import SectionGeneral, { Payload as PayloadGeneral } from './SectionGeneral.vue';
import SectionSession from './SectionSession.vue';

const SOCIAL_PLATFORMS = ['whatsapp', 'facebook', 'twitter', 'instagram', 'youtube', 'twitch', 'discord', 'web', 'link'];

interface Social {
  label: string;
  url: string;
  type?: typeof SOCIAL_PLATFORMS[number];
}

const votingEvent = useVotingEvent();

const fields = reactive({
  cover: await assetUrl(storageRef(getStorage(), `VotingEvent/${votingEvent.value!.uid}/cover`).toString()),
  scheduleStart: '2022-10-23T09:19',
  scheduleEnd: '',
  socials: [] as Social[],
});

const sectionStates = reactive({
  general: {
    hasChanged: false,
    fields: null as (PayloadGeneral | null),
  },
});
</script>

<template>
  <q-card>
    <section-general
      :title="votingEvent!.title"
      :url="votingEvent!.url"
      :cover-src="fields.cover || undefined"
      @change="(sectionStates.general.hasChanged = true, sectionStates.general.fields = $event)"
      @reset="sectionStates.general.hasChanged = false"
    />

    <q-card-actions
      v-if="sectionStates.general.hasChanged"
      align="right"
    >
      <q-btn
        label="Batalkan"
        flat
        color="grey-10"
      />
      <q-btn
        label="Simpan"
        type="submit"
        color="primary"
      />
    </q-card-actions>

    <q-separator spaced />

    <section-session :is-closed="votingEvent!.isClosed" />

    <q-card-actions align="right">
      <q-btn
        label="Batalkan"
        flat
        color="grey-10"
      />
      <q-btn
        label="Simpan"
        type="submit"
        color="primary"
      />
    </q-card-actions>

    <!-- <q-separator spaced />

            <q-card-section>
              <q-list>
                <q-item-label header>
                  Informasi Publik
                </q-item-label>

                <q-item tag="label">
                  <q-item-section
                    side
                    top
                  >
                    <q-checkbox v-model="votingEvent.isResultPublished" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Tampilkan hasil pemilihan ke publik</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  v-for="el in fields.socials"
                  :key="el.label"
                >
                  <q-item-section>
                    <div class="row q-gutter-md">
                      <q-select
                        v-model="el.type"
                        label="Platform"
                        :options="SOCIAL_PLATFORMS.map((el) => ({ label: capitalCase(el), value: el }))"
                        class="col-3"
                      />
                      <q-input
                        v-model="el.label"
                        label="Sosial media"
                        class="col"
                      />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-btn
                      label="Tambahkan sosial media"
                      icon="add"
                      flat
                      @click="fields.socials.push({ label: '', url: '' })"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                label="Batalkan"
                flat
                color="grey-10"
              />
              <q-btn
                label="Simpan"
                type="submit"
                color="primary"
              />
            </q-card-actions> -->
  </q-card>
</template>
