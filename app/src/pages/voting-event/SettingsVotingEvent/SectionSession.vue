<script lang="ts" setup>
import { computed, reactive } from 'vue';

const props = defineProps<{
  isClosed: boolean;
}>();

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
    </q-list>
  </q-card-section>
</template>
