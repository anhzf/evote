<script setup lang="ts">
import { useHead } from '@vueuse/head';
import DialogLogin from 'components/DialogLogin.vue';
import { signOut } from 'firebase/auth';
import { Dialog, Loading } from 'quasar';
import useVotingEvent from 'src/composables/use-voting-event';
import { provide, ref, watch } from 'vue';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

const votingEvent = useVotingEvent();
const auth = useFirebaseAuth();
const user = useCurrentUser();

const rightDrawerOpen = ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const showLoginDialog = () => {
  Dialog.create({
    component: DialogLogin,
  });
};

const logout = async () => {
  if (auth) {
    await signOut(auth);
  }

  rightDrawerOpen.value = false;
};

watch(votingEvent, (v) => {
  if (v === undefined) Loading.show();
  else Loading.hide();
});

provide('voting-event', votingEvent);

useHead({
  title: () => [votingEvent.value?.title, 'Evote'].filter(Boolean).join(' | '),
});
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header
      elevated
      class="bg-primary text-white"
      height-hint="98"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            flat
            :to="{name: 'Home'}"
          >
            <q-avatar icon="how_to_vote" />
          </q-btn>

          <q-btn
            flat
            no-caps
            :to="{name: 'VotingEvent'}"
          >
            <h1 class="text-h6 m-0 inline-block">
              {{ votingEvent?.title }}
            </h1>
          </q-btn>
        </q-toolbar-title>

        <q-btn
          v-if="user"
          rounded
          unelevated
          @click="toggleRightDrawer"
        >
          <span class="mr-2">{{ user.displayName }}</span>
          <q-avatar icon="account_circle" />
        </q-btn>

        <q-btn
          v-else
          label="Login"
          icon-right="login"
          unelevated
          outline
          @click="showLoginDialog"
        />
      </q-toolbar>

      <q-tabs
        align="left"
        inline-label
      >
        <q-route-tab
          label="Tentang"
          :to="{name: 'VotingEvent'}"
          icon="info"
        />
        <q-route-tab
          label="Beri Suara"
          :to="{name: 'VotingEvent-Vote'}"
          icon="how_to_vote"
        />
        <q-route-tab
          label="Hasil"
          :to="{name: 'VotingEvent-Results'}"
          icon="poll"
        />
        <q-route-tab
          label="Daftar Pemilih"
          :to="{name: 'VotingEvent-Voter'}"
          icon="group"
        />
        <q-route-tab
          label="Pengaturan"
          :to="{name: 'VotingEvent-Settings'}"
          icon="settings"
        />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      elevated
      overlay
    >
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="event" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Agenda Saya</q-item-label>
        </q-item-section>
      </q-item>

      <q-item-label header>
        Akun
      </q-item-label>

      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="manage_accounts" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Akun Saya</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        class="text-red-6"
        @click="logout"
      >
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Keluar</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view v-if="votingEvent" />
    </q-page-container>
  </q-layout>
</template>
