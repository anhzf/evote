<script lang="ts" setup>
import auth from 'actions/auth';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Notify, QForm, useDialogPluginComponent } from 'quasar';
import useVotingEvent from 'src/composables/use-voting-event';
import { getAuth } from 'src/firebase';
import { reactive, ref } from 'vue';

defineEmits(useDialogPluginComponent.emits);

const {
  dialogRef, onDialogHide, onDialogCancel, onDialogOK,
} = useDialogPluginComponent();

const votingEvent = useVotingEvent();
const voteTokenSignInForm = ref<QForm>();
const token = ref('');
const _ui = reactive({
  isLoading: false,
});

const signInWithVoteToken = async () => {
  _ui.isLoading = true;
  if (votingEvent.value) {
    await auth.loginVoteToken({ votingEventId: votingEvent.value.uid, voteToken: token.value });
  }
  _ui.isLoading = false;
  onDialogOK();
};

const signInWithGoogle = () => {
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
    persistent
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin w-full max-w-md">
      <q-card-section class="row justify-between items-center">
        <h2 class="text-h6 m-0">
          Masukkan Token untuk Memilih
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
        <q-form
          ref="voteTokenSignInForm"
          @submit="signInWithVoteToken"
        >
          <q-input
            v-model="token"
            label="Masukkan Token"
            autofocus
          />
        </q-form>
      </q-card-section>

      <q-card-actions vertical>
        <q-btn
          label="Masuk"
          color="primary"
          @click="voteTokenSignInForm?.submit"
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
          @click="signInWithGoogle"
        />
      </q-card-actions>

      <q-inner-loading :showing="_ui.isLoading" />
    </q-card>
  </q-dialog>
</template>
