<template>
  <q-page padding>
    <div class="column items-stretch fit max-w-screen-xs q-mx-auto">
      <q-card
        flat
        class="flex-grow"
      >
        <q-list padding>
          <q-item class="justify-center items-end q-gutter-x-sm q-mb-md">
            <q-avatar size="150px">
              <q-img :src="user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`" />
            </q-avatar>
            <q-btn
              icon="edit"
              round
              flat
            />
          </q-item>

          <q-item>
            <q-item-section>
              <q-input
                label="Nama Anda"
                :model-value="user?.displayName"
                readonly
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-input
                label="Email Anda"
                :model-value="user?.email"
                readonly
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useUser } from 'src/use/useUser';

const user = useUser('auth');
</script>
