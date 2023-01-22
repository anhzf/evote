<script lang="ts" setup>
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Notify, useDialogPluginComponent } from 'quasar';
import { getAuth } from 'src/firebase';
import { ref } from 'vue';

defineEmits(useDialogPluginComponent.emits);

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const token = ref('');

const onGoogleLoginClick = () => {
  const provider = new GoogleAuthProvider();

  return signInWithRedirect(getAuth()!, provider)
    .then(() => Notify.create({
      message: 'Berhasil masuk',
      color: 'positive',
    }));
};
</script>

<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin w-full max-w-md">
      <q-card-section class="row justify-between items-center">
        <h2 class="text-h6 m-0">
          Masuk untuk Memilih
        </h2>

        <q-btn
          icon="close"
          flat
          round
          color="grey-5"
          @click="onDialogCancel"
        />
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
          @click="onGoogleLoginClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
