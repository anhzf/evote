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
          {{ votingEvent?.title || 'Evote' }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="UIState.leftDrawerOpen"
      :show-if-above="!route.meta.fullscreen"
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

        <q-inner-loading :showing="isUserPrivilegeLoading" />
      </q-list>

      <q-space />

      <div
        v-if="user"
        class="q-pa-lg"
      >
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
      <template v-if="!isVotingEventLoading">
        <router-view v-if="votingEvent" />

        <q-page
          v-else
          padding
        >
          <h4 class="q-mb-md">
            404
          </h4>
          <span class="text-subtitle1">
            Data voting tidak ditemukan
          </span>
          <q-btn
            label="Kembali ke beranda"
            to="/"
            class="q-ma-md"
          />
        </q-page>
      </template>

      <q-inner-loading
        :showing="isVotingEventLoading"
        label="Memuat..."
      />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {
  reactive, computed, provide, Ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { useAsyncState, whenever } from '@vueuse/core';
import { useAuthModule } from 'src/modules/Auth';
import { getVotingEventByUrl } from 'src/modules/VotingEvent';
import { useUser } from 'src/use/useUser';
import { SidebarNavItem } from 'src/types/ui';
import { useUserPrivilege } from 'src/use/useUserPrivilege';
import { VotingEvent } from '~/core/dist';

const { login, logout } = useAuthModule();
const user = useUser();
const route = useRoute();

const votingEventUrl = computed(() => String(route.params.votingEventName));

const getVotingEvent = () => getVotingEventByUrl(votingEventUrl.value);

const { state: votingEvent, isLoading: isVotingEventLoading, execute: validateVotingEvent } = useAsyncState(
  getVotingEvent,
  undefined,
  { shallow: true },
);

const { userPrivilege, is, isLoading: isUserPrivilegeLoading } = useUserPrivilege(votingEvent as Ref<VotingEvent> || new VotingEvent());

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
]);

const adminNavItems = Object.freeze<SidebarNavItem[]>([
  {
    label: 'Hasil pemilihan',
    icon: 'poll',
    to: { name: 'VotingEvent_Result' },
  },
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
    onClick: logout,
  },
]);

const guestNavItems = Object.freeze<SidebarNavItem[]>([
  {
    label: 'Masuk',
    icon: 'login',
    clickable: true,
    class: 'text-green-6',
    onClick: login,
  },
]);

const navItems = computed(() => [
  ...defaultNavItems,
  ...((is('OWNER') || is('ADMIN')) ? adminNavItems : []),
  ...(user.value ? userNavItems : guestNavItems),
]);

const UIState = reactive({
  leftDrawerOpen: false,
});

const toggleLeftDrawer = () => {
  UIState.leftDrawerOpen = !UIState.leftDrawerOpen;
};

whenever(votingEventUrl, () => validateVotingEvent());

provide('VotingEvent', votingEvent);
</script>

<style lang="sass" scoped>
.breadcrumb-el
  cursor: pointer
  transition: background-color .3s ease-out

  &:hover
    background-color: rgba(#FFF, .1)
</style>
