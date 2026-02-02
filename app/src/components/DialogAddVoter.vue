<template>
  <q-dialog @hide="onHide">
    <q-card class="q-dialog-plugin w-full max-w-400px">
      <q-card-section>
        <h6 class="q-my-none">
          Add Voter
        </h6>
      </q-card-section>

      <form @submit="onSubmit">
        <q-card-section>
          <q-input
            v-model="voter.meta.NAMA"
            label="Nama"
            :rules="[ val => val !== null && val !== '' || 'Please enter Nama']"
            required
          />
          <q-input
            v-model="voter.meta.STATUS"
            label="Status"
            :rules="[ val => val !== null && val !== '' || 'Please enter Status']"
            required
          />
          <q-select
            v-model="voter.meta.KELAMIN"
            :options="[
              {
                label: 'Laki-laki',
                value: 'L',
              },
              {
                label: 'Perempuan',
                value: 'P',
              },
            ]"
            label="Jenis Kelamin"
            :rules="[ val => val !== null && val !== '' || 'Please select Kelamin']"
            required
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            label="Tambahkan"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Cancel"
            color="grey"
            flat
            v-close-popup
          />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { addDoc, collection, CollectionReference } from 'firebase/firestore';
import { getDb } from 'src/firebase';
import { Voter } from '@anhzf/evote-shared/models';
import useVotingEvent from 'src/composables/use-voting-event';
import { FirebaseError } from 'firebase/app';

const $q = useQuasar();
const votingEvent = useVotingEvent();

const voter = ref<Omit<Voter, 'uid'>>({ // Initialize without uid
  meta: {
    NAMA: '',
    STATUS: '',
    KELAMIN: '',
  },
  isVoted: false,
  createdAt: new Date(),
  $search: { tags: [] },
});

const emit = defineEmits(['refreshTable']);

const onSubmit = async () => {
  try {
    const db = getDb();
    const voterCollectionRef = collection(db, 'VotingEvent', votingEvent.value!.uid, 'Voter') as CollectionReference<Voter>;
    const newVoter: Omit<Voter, 'uid'> = { // Omit uid
      meta: {
        NAMA: voter.value.meta?.NAMA || '',
        STATUS: voter.value.meta?.STATUS || '',
        KELAMIN: voter.value.meta?.KELAMIN || '',
      },
      isVoted: false,
      createdAt: new Date(),
      $search: { tags: [] }, // Initialize $search
    };
    await addDoc(voterCollectionRef, newVoter);
    $q.notify({
      message: 'Voter added successfully',
      color: 'positive',
    });
    emit('refreshTable');
    voter.value = { // Reset without uid
      meta: { NAMA: '', STATUS: '', KELAMIN: '' },
      isVoted: false,
      createdAt: new Date(),
      $search: { tags: [] },
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      $q.notify({
        message: error.message,
        color: 'negative',
      });
    } else {
      console.error(error);
    }
  }
};

const onHide = () => {
  voter.value = { // Reset without uid
    meta: { NAMA: '', STATUS: '', KELAMIN: '' },
    isVoted: false,
    createdAt: new Date(),
    $search: { tags: [] },
  };
};
</script>
