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
        :showing="_ui.isImportingLoading"
        label="Menyimpan..."
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps, defineEmits, ref, Ref, reactive, inject,
} from 'vue';
import { Notify, useDialogPluginComponent } from 'quasar';
import { useAsyncState, whenever } from '@vueuse/core';
import { parse } from 'csv-parse/browser/esm/sync';
import { Voter, voterOperations, VotingEvent } from '@anhzf/evote-shared/models';

export interface Props {
  votingEventId: string;
}

const props = defineProps<Props>();
defineEmits([...useDialogPluginComponent.emits]);

const {
  dialogRef, onDialogHide, onDialogOK, onDialogCancel,
} = useDialogPluginComponent();

const votingEvent = inject<Ref<VotingEvent>>('voting-event')!;

const saveVoterBatch = async (voters: Voter[]) => {
  //
};

const _ui = reactive({
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
  _ui.isImportingLoading = true;

  const voters = parsed.value.map((el) => voterOperations.create({ meta: el }));

  await saveVoterBatch(voters);
  _ui.isImportingLoading = false;
};

const onOKClick = () => {
  saveImportedData()
    .then(() => Notify.create({ message: `Berhasil menambahkan ${parsed.value.length} pemilih!` }))
    .finally(onDialogOK);
};

const onCancelClick = () => {
  onDialogCancel();
};

whenever(uploaded, () => execute());
</script>
