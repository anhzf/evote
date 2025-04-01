<script lang="ts" setup>
import { useImage } from '@vueuse/core';

const coverSrc = 'https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/1272/cached.offlinehbpl.hbpl.co.uk/news/KMP/USelection.png';
const { isLoading } = useImage({ src: coverSrc });
</script>

<template>
  <div class="py-6">
    <img
      v-if="!isLoading"
      :src="coverSrc"
      class="w-full aspect-[2/1] object-cover"
    >

    <USkeleton
      v-else
      class="w-full aspect-[2/1]"
    />


  </div>
</template>
