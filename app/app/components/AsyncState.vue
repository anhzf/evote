<script lang="ts" setup generic="T">
import { useAsyncState, whenever } from '@vueuse/core';

interface Props {
  value: Promise<T>;
  init: T;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  error: [error: unknown];
}>();

const {
  state, isLoading, execute, error,
} = useAsyncState<T>(() => props.value, props.init, {
  onError: emit.bind(null, 'error'),
});

whenever(() => props.value, () => execute());
</script>

<template>
  <slot
    :state="state"
    :is-loading="isLoading"
    :execute="execute"
    :error="error"
  />
</template>
