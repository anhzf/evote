<template>
  <q-page padding>
    <div class="column items-stretch fit max-w-screen-xs q-mx-auto">
      <div class="row items-center q-gutter-x-md q-mt-md q-mb-lg">
        <q-btn
          icon="arrow_back"
          flat
          round
          color="grey-7"
          @click="$router.back"
        />

        <!-- Wrap with div, because the q-margin utils will replace the gutter -->
        <div>
          <h6 class="q-ma-none">
            Buat acara Voting
          </h6>
        </div>
      </div>

      <q-card class="flex-grow">
        <q-card-section>
          <q-list padding>
            <q-item>
              <q-item-section>
                <q-input
                  v-model="form.title"
                  label="Judul acara"
                  outlined
                  autofocus
                  :rules="[required]"
                />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-input
                  v-model="url"
                  label="Alamat untuk akses acara (opsional)"
                  outlined
                  debounce="300"
                  :hint="urlPreview"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions>
          <q-btn
            label="Buat acara"
            color="primary"
            @click="onClickCreate"
          />
          <q-btn
            label="Batalkan dan Kembali"
            flat
            @click="$router.back"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { Notify } from 'quasar';
import { nanoid } from 'nanoid';
import { paramCase } from 'param-case';
import { useUser } from 'src/use/useUser';
import { createVotingEvent } from 'src/modules/VotingEvent';
import { required } from 'src/utils/field-rule';
import { VotingEvent } from '~/shared/core';

useUser('auth');

const form = reactive({
  id: nanoid(7),
  title: '',
  url: '',
});

const url = computed<string>({
  get: () => form.url || form.id,
  set(v) {
    form.url = paramCase(v);
  },
});
const urlPreview = computed(() => `${window.location.origin}/${url.value}`);

const onClickCreate = async () => {
  const entity = new VotingEvent().fill(({
    id: form.id,
    title: form.title,
    url: url.value,
  }));

  try {
    await createVotingEvent(entity);
  } catch (error) {
    Notify.create({
      message: String(error),
      color: 'negative',
    });

    console.error(error);
  }
};
</script>
