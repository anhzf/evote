<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin column no-wrap full-width max-w-screen-sm">
      <q-card-section class="row justify-between items-center">
        <h6 class="q-my-none">
          Impor data
        </h6>

        <q-btn
          icon="close"
          flat
          round
          color="grey-5"
          @click="onDialogCancel"
        />
      </q-card-section>

      <q-card-section class="q-mb-sm q-gutter-y-sm scroll">
        <q-file
          v-model="uploaded"
          label="Pilih file"
          filled
          accept=".csv"
          clearable
          counter
          :counter-label="(props) => props.totalSize"
        >
          <template #prepend>
            <q-icon name="upload_file" />
          </template>
        </q-file>

        <q-table
          :rows="parsed"
          :loading="isLoading"
          flat
          bordered
          dense
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Batal"
          flat
          color="primary"
          @click="onCancelClick"
        />

        <q-btn
          label="Impor"
          color="primary"
          @click="onOKClick"
        />
      </q-card-actions>

      <q-inner-loading
        :showing="UIState.isImportingLoading"
        label="Menyimpan..."
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps, defineEmits, ref, reactive,
} from 'vue';
import { Notify, useDialogPluginComponent } from 'quasar';
import { useAsyncState, whenever } from '@vueuse/core';
import { parse } from 'csv-parse/sync';
import { saveVoterBatch } from 'src/modules/Voter';
import { Voter } from '~/core/dist';

export interface Props {
  votingEventId: string;
}

const props = defineProps<Props>();
defineEmits([...useDialogPluginComponent.emits]);

const {
  dialogRef, onDialogHide, onDialogOK, onDialogCancel,
} = useDialogPluginComponent();

const UIState = reactive({
  isImportingLoading: false,
});

const uploaded = ref<File>();

const parseCSV = async () => {
  const input = await uploaded.value?.text() || '';

  return parse(input, {
    columns: true,
    delimiter: ';',
  }) as Record<string, unknown>[];
};

const { state: parsed, isLoading, execute } = useAsyncState(parseCSV, []);

const saveImportedData = async () => {
  UIState.isImportingLoading = true;

  const voters = parsed.value.map((el) => new Voter().fill({ meta: el }));

  await saveVoterBatch(props.votingEventId, voters);
  UIState.isImportingLoading = false;
};

const onOKClick = () => {
  saveImportedData()
    .then(() => Notify.create({ message: `Berhasil menambahkan ${parsed.value.length} pemilih!` }))
    .finally(onDialogOK);
};

const onCancelClick = () => {
  onDialogCancel();
};

whenever(uploaded, execute);
</script>
