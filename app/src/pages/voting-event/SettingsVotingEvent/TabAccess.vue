<script lang="ts" setup>
import invitation from 'actions/invitation';
import { collection } from 'firebase/firestore';
import {
  Dialog, QBtn,
  QSpace, QTableColumn,
  patterns, Loading, Notify,
} from 'quasar';
import { useDocs } from 'src/composables/use-firestore';
import useVotingEvent from 'src/composables/use-voting-event';
import { getDb } from 'src/firebase';
import { showTheLoadingAndNotifyErrorAsync } from 'src/utils/ui';
import { computed } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns: QTableColumn[] = [
  {
    name: 'displayName', label: 'Nama', field: 'displayName', align: 'left',
  },
  {
    name: 'role', label: 'Akses', field: 'role',
  },
  {
    name: 'actions', label: '', field: 'uid', align: 'right',
  },
];

const votingEvent = useVotingEvent();
const userColl = computed(() => collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'User'));
// const accessList = useDocs(collectionRef);

// const users = [];
const rows = useDocs(userColl);

const onInviteClick = () => {
  Dialog.create({
    title: 'Tambahkan Admin',
    prompt: {
      label: 'Email',
      model: '',
      type: 'email',
      rules: ['email'],
      isValid: patterns.testPattern.email,
    },
    ok: {
      label: 'Undang',
      color: 'primary',
    },
  })
    .onOk((email) => showTheLoadingAndNotifyErrorAsync(async () => {
      await invitation.invite({
        votingEventId: votingEvent.value!.uid,
        email,
      });

      Notify.create({
        type: 'positive',
        message: `Berhasil mengundang <strong>${email}</strong>!`,
        html: true,
      });
    }));
};
</script>

<template>
  <q-table
    :columns
    :rows="rows?.docs.map(val => ({
      ...val.data(),
      uid: val.id,
    })) ?? []"
  >
    <template #top>
      <q-space />
      <q-btn
        label="Undang"
        icon="add"
        color="primary"
        outline
        @click="onInviteClick"
      />
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props" />
    </template>
  </q-table>
</template>
