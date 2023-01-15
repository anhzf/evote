<template>
  <q-layout view="hHh LpR fff">
    <q-header
      elevated
      class="bg-primary text-white"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-btn
            flat
            no-caps
            :to="{name: 'Home'}"
          >
            <q-avatar icon="how_to_vote" />
            <span class="text-lg ml-2">Evote App</span>
          </q-btn>
        </q-toolbar-title>

        <div>
          <q-btn
            label="anhzf.dev"
            href="https://anhzf.dev"
            target="_blank"
            flat
            icon-right="open_in_new"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page
        padding
        class="columns"
      >
        <section>
          <p>Hai👋, Selamat Datang di</p>
          <h1 class="m-0">
            <span>Aplikasi Sistem Pemungutan Suara Online</span>
          </h1>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>
