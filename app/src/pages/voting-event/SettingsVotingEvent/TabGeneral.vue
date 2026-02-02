<script lang="ts" setup>
import AsyncState from 'components/AsyncState.vue';
import { ref as storageRef } from 'firebase/storage';
import votingEventActions from 'src/actions/voting-event';
import useVotingEvent from 'src/composables/use-voting-event';
import { SOCIAL_PLATFORMS } from 'src/constants';
import { getStorage } from 'src/firebase';
import { assetUrl } from 'src/utils/asset-url';
import { showTheLoadingAndNotifyErrorAsync } from 'src/utils/ui';
import { ref } from 'vue';
import SectionGeneral, { Payload as PayloadGeneral } from './SectionGeneral.vue';
import SectionSession from './SectionSession.vue';

interface Social {
  label: string;
  url: string;
  type: keyof typeof SOCIAL_PLATFORMS;
}

const SOCIAL_OPTIONS = Object.entries(SOCIAL_PLATFORMS).map(([key, { icon }]) => ({
  label: key,
  value: key,
  icon,
}));

const emit = defineEmits<{
  'need-refresh': [],
}>();

const votingEvent = useVotingEvent();

const fields = ref({
  cover: storageRef(getStorage(), `VotingEvent/${votingEvent.value!.uid}/cover`).toString(),
  scheduleStart: '2022-10-23T09:19',
  scheduleEnd: '',
  socials: (votingEvent.value!.socials ?? []) as Social[],
});

const sectionStates = ref({
  general: {
    hasChanged: false,
    fields: null as (PayloadGeneral | null),
  },
});

const onSocialsSubmit = () => {
  showTheLoadingAndNotifyErrorAsync(async () => {
    await votingEventActions.updateSocials({
      votingEventId: votingEvent.value!.uid,
      items: fields.value.socials,
    });
    emit('need-refresh');
  });
};
</script>

<template>
  <q-card>
    <AsyncState
      :value="assetUrl(fields.cover)"
      init="#"
      #="{state: coverUrl, error}"
    >
      <section-general
        :title="votingEvent!.title"
        :url="votingEvent!.url"
        :cover-src="!error ? coverUrl : 'https://placehold.co/200x150?text=No+cover+image'"
        @change="(sectionStates.general.hasChanged = true, sectionStates.general.fields = $event)"
        @reset="sectionStates.general.hasChanged = false"
      />
    </AsyncState>

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

    <q-separator spaced />

    <form @submit.prevent="onSocialsSubmit">
      <q-card-section>
        <q-list>
          <q-item-label header>
            Informasi Publik
          </q-item-label>

          <!-- <q-item tag="label">
          <q-item-section
            side
            top
          >
            <q-checkbox v-model="votingEvent.isResultPublished" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Tampilkan hasil pemilihan ke publik</q-item-label>
          </q-item-section>
        </q-item> -->

          <q-item
            v-for="(el, i) in fields.socials"
            :key="i"
          >
            <q-item-section>
              <div class="row q-gutter-md">
                <q-select
                  v-model="el.type"
                  label="Platform"
                  :options="SOCIAL_OPTIONS"
                  dense
                  emit-value
                  map-options
                  class="col-3"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>
                          {{ scope.opt.description }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template #prepend>
                    <q-icon
                      class="cursor-pointer"
                      :name="SOCIAL_PLATFORMS[el.type!]?.icon"
                    />
                  </template>
                </q-select>

                <div class="col">
                  <q-input
                    v-model="el.label"
                    label="Nama"
                    outlined
                    dense
                    hint=" "
                    :disable="!el.type"
                  >
                    <template #after>
                      <q-btn
                        flat
                        round
                        icon="close"
                        @click="fields.socials.splice(fields.socials.indexOf(el), 1)"
                      />
                    </template>
                  </q-input>

                  <q-input
                    v-model="el.url"
                    label="Alamat/Nomor/Username"
                    outlined
                    dense
                    :placeholder="SOCIAL_PLATFORMS[el.type!]?.field.placeholder"
                    :rules="[SOCIAL_PLATFORMS[el.type!]?.field.isValid]"
                    :disable="!el.type"
                  />
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-btn
                label="Tambahkan sosial media"
                icon="add"
                flat
                :disable="fields.socials.at(-1)?.url === '' && fields.socials.at(-1)?.label === ''"
                @click="fields.socials.push({ label: '', url: '', type: 'link' })"
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
      </q-card-actions>
    </form>
  </q-card>
</template>
