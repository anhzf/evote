<script lang="ts" setup generic="T">
import { Ref, ref, watch } from 'vue';

interface Props {
  value: T;
  watchChanges?: boolean;
}

const props = defineProps<Props>();

const state = ref(props.value) as Ref<T>;
const setState = (value: T) => {
  state.value = value;
};

if (props.watchChanges) {
  watch(
    () => props.value,
    (newValue) => {
      state.value = newValue;
    },
  );
}
</script>

<template>
  <slot
    :state="([state, setState] as const)"
    :bind-v-model="{modelValue: state, 'onUpdate:modelValue': setState}"
  />
</template>
