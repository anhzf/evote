<template>
  <q-page padding>
    <div class="column items-stretch max-w-screen-xs q-mx-auto q-gutter-y-xl">
      <div class="column items-center">
        <div class="col justify-center">
          <div class="row items-end q-gutter-x-sm">
            <q-btn round>
              <q-avatar size="150px">
                <img src="https://cdn.quasar.dev/img/avatar.png">
              </q-avatar>
            </q-btn>
            <q-icon
              name="edit"
              size="sm"
            />
          </div>
        </div>
      </div>

      <div class="col">
        <span>Nama Anda</span>
        <q-input
          v-model="name"
          style="width: 100%"
          :dense="dense"
        >
          <template #append>
            <q-icon
              name="edit"
              class="cursor-pointer"
              @click="name = ''"
            />
          </template>
        </q-input>
      </div>

      <div class="col">
        <span>Email Anda</span>
        <q-input
          v-model="name"
          style="width: 100%"
          :dense="dense"
        >
          <template #append>
            <q-icon
              name="edit"
              class="cursor-pointer"
              @click="name = ''"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUser } from 'src/use/useUser';

useUser('auth');

export default defineComponent({
  setup() {
    return {
      name: ref(''),
      dense: ref(false),
    };
  },
});
</script>
