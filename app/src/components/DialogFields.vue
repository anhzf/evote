<script lang="ts" setup>
import { useDialogPluginComponent, type QBtnProps } from 'quasar';
import { useId, type Component } from 'vue';

defineProps<{
  title: string;
  fields: {
    name: string;
    field: Component;
  }[];
  actions?: string | QBtnProps | {
    name: string;
    action: Component;
  }[];
  isValid?:() => boolean;
}>();

defineEmits(useDialogPluginComponent.emits);

defineOptions({ inheritAttrs: false });

const {
  dialogRef, onDialogHide, onDialogCancel, onDialogOK,
} = useDialogPluginComponent();

const formId = useId();

const onSubmit = (ev: Event) => {
  onDialogOK(ev);
};
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      v-bind="$attrs"
    >
      <q-card-section class="row justify-between items-center">
        <h2 class="text-h6 m-0">
          {{ title }}
        </h2>

        <q-btn
          icon="close"
          flat
          round
          color="grey-5"
          @click="onDialogCancel"
        />
      </q-card-section>

      <q-card-section>
        <q-form
          :id="formId"
          @submit="onSubmit"
        >
          <component
            v-for="item in fields"
            :is="item.field"
            :key="item.name"
          />
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn
          v-if="typeof actions === 'string'"
          type="submit"
          :form="formId"
          :label="actions"
        />

        <template v-else-if="Array.isArray(actions)">
          <component
            v-for="item in actions"
            :key="item.name"
            :is="item.action"
            v-bind="item.name === 'submit' ? { type: 'submit', form: formId } : {}"
          />
        </template>

        <q-btn
          v-else-if="typeof actions === 'object'"
          v-bind="actions"
          type="submit"
          :form="formId"
        />

        <q-btn
          v-else
          type="submit"
          :form="formId"
          label="Submit"
          :disable="isValid ? !isValid() : false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
