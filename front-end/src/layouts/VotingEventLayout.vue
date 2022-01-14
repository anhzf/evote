<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ votingEvent.title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="UIState.leftDrawerOpen"
      :show-if-above="$route.path !== '/'"
      bordered
      class="column"
    >
      <q-list>
        <q-item-label header>
          Menu
        </q-item-label>

        <q-item
          v-for="({ label, icon, ...props }) in navItems"
          :key="label"
          active-class="text-primary bg-blue-grey-1"
          v-bind="props"
        >
          <q-item-section avatar>
            <q-icon :name="icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-space />

      <div class="q-pa-lg">
        <q-btn
          label="Lihat acara voting saya lainnya"
          icon="arrow_back"
          flat
          size="sm"
          color="secondary"
          :to="{ name: 'VotingEvents' }"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { reactive, computed, provide } from 'vue';
import { useRoute } from 'vue-router';
import { Notify } from 'quasar';
import { VotingEvent } from '@evote/core';
import { SidebarNavItem } from 'src/types/ui';

const defaultNavItems = Object.freeze<SidebarNavItem[]>([
  {
    label: 'Pilih sekarang',
    icon: 'how_to_vote',
    to: { name: 'VotingEvent_Vote' },
  },
  {
    label: 'Tentang pemilihan',
    icon: 'info',
    to: { name: 'VotingEvent' },
    exact: true,
  },
  {
    label: 'Hasil pemilihan',
    icon: 'poll',
    to: { name: 'VotingEvent_Result' },
  },
]);

const adminNavItems = Object.freeze<SidebarNavItem[]>([
  {
    label: 'Daftar Pemilih',
    icon: 'people',
    to: { name: 'VotingEvent_Voter' },
  },
  {
    label: 'Pengaturan',
    icon: 'settings',
    to: { name: 'VotingEvent_Settings' },
  },
]);

const userNavItems = Object.freeze<SidebarNavItem[]>([
  {
    label: 'Keluar',
    icon: 'logout',
    clickable: true,
    class: 'text-red-6',
    onClick: () => Notify.create('Berhasil keluar!'),
  },
]);

const navItems = computed(() => [
  ...defaultNavItems,
  ...adminNavItems,
  ...userNavItems,
]);

const route = useRoute();
const votingEvent = computed(() => new VotingEvent().fill({
  title: 'Pemilihan Presiden OSIS SMPN 23 Surakarta',
  url: String(route.params.votingEventName),
}));

const UIState = reactive({
  leftDrawerOpen: false,
});

const toggleLeftDrawer = () => {
  UIState.leftDrawerOpen = !UIState.leftDrawerOpen;
};

provide('VotingEventName', votingEvent);
</script>

<style lang="sass" scoped>
.breadcrumb-el
  cursor: pointer
  transition: background-color .3s ease-out

  &:hover
    background-color: rgba(#FFF, .1)
</style>
