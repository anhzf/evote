<template>
  <q-dialog
    ref="dialogRef"
    full-width
    full-height
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin column no-wrap">
      <q-card-section class="row justify-between items-center">
        <h6 class="q-my-none">
          {{ data.title }}
        </h6>

        <q-btn
          icon="close"
          flat
          round
          color="grey-5"
          @click="onDialogHide"
        />
      </q-card-section>

      <q-card-section class="column no-wrap scroll">
        <q-img
          :src="`https://i.pravatar.cc/200?u=${data.title}`"
          width="100%"
          height="60vh"
          class="col-shrink-0 self-center max-w-screen-xs"
        />

        <q-markdown
          :src="desc"
          no-html
          class="self-center full-width"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          label="Lihat pilihan yang lain"
          outline
          color="primary"
          @click="onCancelClick"
        />

        <q-btn
          label="Pilih"
          color="primary"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { VoteObject } from '@evote/core';

interface Props {
  data: VoteObject;
}

defineEmits([...useDialogPluginComponent.emits]);
defineProps<Props>();

const {
  dialogRef, onDialogHide, onDialogOK, onDialogCancel,
} = useDialogPluginComponent();
const desc = `:::
**Visi**
- Menyejahterakan rakyat Indonesia
- Lorem ipsum lorem ipsum

**Misi**
- Menyejahterakan rakyat Indonesia
- Lorem ipsum lorem ipsum

**Program Unggulan**
- Menyejahterakan rakyat Indonesia
- Lorem ipsum lorem ipsum
:::`;

const onOKClick = () => {
  onDialogOK();
};

const onCancelClick = () => {
  onDialogCancel();
};
</script>
