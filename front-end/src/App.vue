<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'src/firebase';
import { useAuthStore } from 'src/store/useAuthStore';

const auth = getAuth();
const authStore = useAuthStore();
onAuthStateChanged(auth, (user) => {
  authStore.user.value = user;
  authStore.isReady.value = true;
});
</script>
