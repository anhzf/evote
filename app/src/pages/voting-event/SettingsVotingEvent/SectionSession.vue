<script lang="ts" setup>
import { VotingEvent } from '@anhzf/evote-shared/models';
import votingEventActions from 'actions/voting-event';
import { Dialog, Loading, Notify } from 'quasar';
import {
  Ref, computed, inject, reactive,
} from 'vue';

const props = defineProps<{
  isClosed: boolean;
}>();

const votingEvent = inject<Ref<VotingEvent>>('voting-event');

const fields = reactive({
  isClosed: props.isClosed,
  scheduleStart: '',
  scheduleEnd: '',
});

const isScheduled = computed({
  get: () => !!fields.scheduleStart,
  set: (v) => {
    fields.scheduleStart = v ? new Date().toISOString().slice(0, 16) : '';
  },
});

const onResetClick = () => {
  Dialog.create({
    title: 'Hapus semua suara',
    message: 'Apakah Anda yakin ingin menghapus semua suara yang sudah masuk?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    Loading.show({ message: 'Menghapus suara...' });

    try {
      if (!votingEvent?.value) {
        throw new Error('Something wrong! Internal missing payload.');
      }

      await votingEventActions.reset(votingEvent.value.uid);
    } catch (err) {
      Notify.create({
        message: err instanceof Error ? err.message : String(err) || 'Gagal menghapus suara!',
        color: 'negative',
      });
    } finally {
      Loading.hide();
    }
  });
};
</script>

<template>
  <q-card-section>
    <q-item-label header>
      Sesi Acara
    </q-item-label>

    <q-list>
      <q-item tag="label">
        <q-item-section
          side
          top
        >
          <q-toggle v-model="fields.isClosed" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Tutup sesi pemilihan</q-item-label>
          <q-item-label caption>
            Tutup acara, pemilih tidak dapat memilih kandidat.
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item
        v-model="isScheduled"
        hide-expand-icon
        :disable="fields.isClosed"
      >
        <template #header>
          <q-item-section
            side
            top
          >
            <q-toggle v-model="isScheduled" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Jadwalkan acara</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    Mulai
                  </q-item-label>
                  <q-item-label caption>
                    Sesi pemilihan akan otomatis dimulai.
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input
                    v-model="fields.scheduleStart"
                    type="datetime-local"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    Selesai
                  </q-item-label>
                  <q-item-label caption>
                    Sesi pemilihan akan otomatis ditutup.
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-input
                    v-model="fields.scheduleEnd"
                    type="datetime-local"
                    :min="fields.scheduleStart"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-item>
        <q-item-section>
          Hapus semua suara
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Reset"
            color="negative"
            @click="onResetClick"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <slot />
  </q-card-section>
</template>
