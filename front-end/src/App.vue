<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { getAnalytics, getAuth } from 'src/firebase';
import { useAuthStore } from 'src/store/useAuthStore';

const auth = getAuth();
const authStore = useAuthStore();
onAuthStateChanged(auth, (user) => {
  authStore.user.value = user;
  authStore.isReady.value = true;
});

onMounted(() => getAnalytics());
</script>
