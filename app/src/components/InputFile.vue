<script lang="ts" setup>
import { useId } from 'vue';

const model = defineModel<File | null>();

const id = useId();

const onChange = (e: Event) => {
  const elm = e.target as HTMLInputElement;
  model.value = elm.files?.[0];
};
</script>

<template>
  <div
    class="opacity-0 absolute inset-0 w-full h-full"
    @click.stop
  >
    <input
      :id="id"
      type="file"
      accept="image/jpg, image/jpeg, image/png, image/webp"
      class="hidden"
      @change="onChange"
    >
    <label
      :for="id"
      class="absolute inset-0 w-full h-full cursor-pointer"
    />
  </div>
</template>
