<template>
  <q-page
    padding
    class="column mx-a max-w-screen-lg"
  >
    <q-img
      src="/assets/mockup/voting-event-banner.jpg"
      :ratio="16/9"
      fit="scale-down"
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
  </q-page>
</template>
