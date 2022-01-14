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
          Evote
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="UIState.leftDrawerOpen"
      :show-if-above="!$route.meta.fullscreen"
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
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { Notify } from 'quasar';
import { SidebarNavItem } from 'src/types/ui';

const guestNavItems = Object.freeze<SidebarNavItem[]>([
  {
    label: 'Beranda',
    icon: 'home',
    to: '/',
    exact: true,
  },
  {
    label: 'Acara Voting Saya',
    icon: 'ballot',
    to: { name: 'VotingEvents' },
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
  ...guestNavItems,
  ...userNavItems,
]);

const UIState = reactive({
  leftDrawerOpen: false,
});

const toggleLeftDrawer = () => {
  UIState.leftDrawerOpen = !UIState.leftDrawerOpen;
};
</script>

<style lang="sass" scoped>
.breadcrumb-el
  cursor: pointer
  transition: background-color .3s ease-out

  &:hover
    background-color: rgba(#FFF, .1)
</style>
