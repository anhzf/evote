<template>
  <q-dialog
    ref="dialogRef"
    full-height
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin column no-wrap w-full max-w-screen-sm">
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
          :src="imgSrc"
          width="100%"
          height="60vh"
          class="flex-shrink-0 self-center max-w-screen-xs"
        />

        <q-markdown
          :src="desc"
          no-html
          class="flex-grow self-center full-width"
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
import { useAsyncState } from '@vueuse/core';
import { getVoteObjectDescUrl } from 'src/modules/VoteObject';

interface Props {
  votingId: string;
  data: VoteObject;
  imgSrc: string;
}

defineEmits([...useDialogPluginComponent.emits]);
const props = defineProps<Props>();

const {
  dialogRef, onDialogHide, onDialogOK, onDialogCancel,
} = useDialogPluginComponent();

const { state: desc } = useAsyncState(getVoteObjectDescUrl(props.votingId, props.data.id), '');

const onOKClick = () => {
  onDialogOK();
};

const onCancelClick = () => {
  onDialogCancel();
};
</script>
