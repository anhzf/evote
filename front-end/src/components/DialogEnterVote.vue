<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin column no-wrap">
      <q-card-section class="row justify-between items-center">
        <h6 class="q-my-none">
          ⚠️ Anda belum memiliki identitas
        </h6>

        <q-btn
          icon="close"
          flat
          round
          color="grey-5"
          @click="onDialogCancel"
        />
      </q-card-section>

      <q-card-section class="q-mb-sm">
        <p class="q-mb-none">
          Untuk memberikan suara anda harus terdaftar sebagai pemilih.
        </p>
        <p>Anda bisa <b>login</b> terlebih dahulu atau masuk <b>menggunakan token</b> yang didapatkan dari Admin penyelenggara pemilihan anda.</p>

        <q-input
          v-model="token"
          label="Masukkan token..."
          type="text"
          filled
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Masuk dengan akun"
          outline
          color="primary"
          @click="login"
        />

        <q-btn
          label="Masuk dengan token"
          color="primary"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useAuthModule } from 'src/modules/Auth';

defineEmits([...useDialogPluginComponent.emits]);

const {
  dialogRef, onDialogHide, onDialogOK, onDialogCancel,
} = useDialogPluginComponent();
const { login } = useAuthModule();

const token = ref('');

const onOKClick = () => {
  onDialogOK(token.value);
};
</script>
