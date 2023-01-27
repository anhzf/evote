<script setup lang="ts">
import { useAsyncState, whenever } from '@vueuse/core';
import { useHead } from '@vueuse/head';
import { VotingEventUser } from 'app/../packages/shared/models';
import DialogLogin from 'components/DialogLogin.vue';
import { signOut } from 'firebase/auth';
import {
  collection, doc, getDoc, getDocs, limitToLast, orderBy, query, Timestamp, where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Dialog, Loading, Notify } from 'quasar';
import useVotingEvent from 'src/composables/use-voting-event';
import { getDb, getFns } from 'src/firebase';
import { provide, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUser, useFirebaseAuth } from 'vuefire';

const router = useRouter();
const votingEvent = useVotingEvent();
const auth = useFirebaseAuth();
const user = useCurrentUser();
const { state: votingEventUser, execute: refreshVotingEventUser } = useAsyncState(async () => {
  const docRef = doc(getDb(), 'VotingEvent', votingEvent.value!.uid, 'User', user.value!.uid);
  const snapshot = await getDoc(docRef);
  return snapshot.data() as VotingEventUser;
}, undefined, { immediate: false, throwError: true });

const rightDrawerOpen = ref(false);

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const showLoginDialog = () => {
  Dialog.create({
    component: DialogLogin,
  })
    .onOk(() => {
      router.push({ name: 'VotingEvent-Vote' });
    });
};

const logout = async () => {
  const stopLoading = Loading.show();

  if (auth) {
    await signOut(auth);
  }

  stopLoading();
  router.push({ name: 'VotingEvent' });
  rightDrawerOpen.value = false;
};

watch(votingEvent, (v) => {
  if (v === undefined) Loading.show();
  else Loading.hide();
});

whenever(() => !!(user.value && votingEvent.value), async () => {
  refreshVotingEventUser();

  const invitationQ = query(
    collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Invitation'),
    where('email', '==', user.value!.email),
    where('acceptedAt', '==', null),
    where('expiredAt', '>=', Timestamp.now()),
    orderBy('expiredAt'),
    limitToLast(1),
  );
  const invitationSnapshots = await getDocs(invitationQ);
  const [invitation] = invitationSnapshots.docs;

  if (invitation) {
    Dialog.create({
      title: 'Undangan',
      message: `Anda telah diundang untuk menjadi ${invitation.data().role} dalam ${votingEvent.value?.title}.`,
      persistent: true,
      ok: {
        label: 'Terima',
        color: 'primary',
      },
      cancel: 'Tolak',
    })
      .onOk(async () => {
        Loading.show({ message: 'Memproses...' });
        try {
          await httpsCallable(getFns(), 'invitation-accept')(invitation.ref.path);
          refreshVotingEventUser();
          router.push({ name: 'VotingEvent-Voter' });
        } catch (error) {
          if (error instanceof Error) Notify.create({ color: 'negative', message: error.message });
          else console.error(error);
        } finally {
          Loading.hide();
        }
      });
  }
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
          v-if="votingEventUser?.role === 'admin'"
          label="Hasil"
          :to="{name: 'VotingEvent-Results'}"
          icon="poll"
        />
        <q-route-tab
          v-if="votingEventUser?.role === 'admin'"
          label="Daftar Pemilih"
          :to="{name: 'VotingEvent-Voter'}"
          icon="group"
        />
        <q-route-tab
          v-if="votingEventUser?.role === 'admin'"
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
