<template>
  <q-page class="row items-center justify-evenly">
    <q-form @submit="onSubmit">
      <q-input v-model="token" />
      <q-btn label="OK" type="submit" />
    </q-form>

    <q-btn label="with G" @click="login" />
  </q-page>
</template>

<script setup lang="ts">
import auth from 'actions/auth';
import { getAuth } from 'src/firebase';
import { onMounted, ref } from 'vue';

const token = ref('');
const onSubmit = () => {
  auth.loginVoteToken({ votingEventId: 'gtGbHWcGNGWw3tNi1Asb', voteToken: token.value });
};
const login = () => {
  auth.login();
};

onMounted(() => {
  getAuth().onAuthStateChanged((user) => {
    if (user) {
      console.log('user', user);
    }
  });
});
</script>
