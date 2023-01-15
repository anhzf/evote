<script lang="ts" setup>
// import { ref } from 'vue';

// const token = ref('');
</script>

<template>
  <q-page
    padding
    class="column mx-a max-w-screen-lg"
  >
    <q-img
      src="/assets/mockup/voting-event-banner.jpg"
      :ratio="16/9"
    />

    <section class="column">
      <h2 class="text-caption text-grey-10">
        Media sosial dan Kontak
      </h2>

      <ul class="list-none m-0 p-0 flex gap-4">
        <li>
          <q-btn
            label="DEMA UNS"
            icon="mdi-facebook"
            flat
            href="https://www.facebook.com/"
            target="_blank"
          />
        </li>
        <li>
          <q-btn
            label="@dema.uns"
            icon="mdi-instagram"
            flat
            href="https://www.instagram.com/"
            target="_blank"
          />
        </li>
        <li>
          <q-btn
            label="pemilihan@dema.uns.ac.id"
            icon="mdi-email"
            flat
            href="mailto:me@anhzf.dev"
            target="_blank"
          />
        </li>
        <li>
          <q-btn
            label="dema.uns.ac.id"
            icon="mdi-web"
            flat
            href="https://dema.uns.ac.id/"
            target="_blank"
          />
        </li>
      </ul>
    </section>

    <!-- <section class="column items-center q-pa-md">
      <q-card class="w-full max-w-md">
        <q-card-section>
          <h2 class="text-h6 m0">
            Masuk untuk Memilih
          </h2>
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-input
              v-model="token"
              label="Masukkan Token"
            />
          </q-form>
        </q-card-section>

        <q-card-actions vertical>
          <q-btn
            label="Masuk"
            color="primary"
          />
        </q-card-actions>

        <q-separator />

        <q-card-section>
          <p class="text-center text-grey-8">
            Atau masuk dengan
          </p>
        </q-card-section>

        <q-card-actions vertical>
          <q-btn
            label="Masuk dengan Google"
          />
        </q-card-actions>
      </q-card>
    </section> -->
  </q-page>
</template>
