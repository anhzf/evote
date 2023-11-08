<script lang="ts" setup>

</script>

<template>
  <q-card-section>
    <q-list>
      <q-item-label header>
        Informasi Publik
      </q-item-label>

      <q-item tag="label">
        <q-item-section
          side
          top
        >
          <q-checkbox v-model="fields.isResultPublished" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Tampilkan hasil pemilihan ke publik</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-for="el in fields.socials"
        :key="el.label"
      >
        <q-item-section>
          <div class="row q-gutter-md">
            <q-select
              v-model="el.type"
              label="Platform"
              :options="SOCIAL_PLATFORMS.map((el) => ({ label: capitalCase(el), value: el }))"
              class="col-3"
            />
            <q-input
              v-model="el.label"
              label="Sosial media"
              class="col"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-btn
            label="Tambahkan sosial media"
            icon="add"
            flat
            @click="fields.socials.push({ label: '', url: '' })"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <slot />
  </q-card-section>
</template>
