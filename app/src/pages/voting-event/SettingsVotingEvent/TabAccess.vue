<script lang="ts" setup>
import invitation from 'actions/invitation';
import { collection } from 'firebase/firestore';
import {
  Dialog,
  Notify,
  QBtn,
  QSpace, QTableColumn,
  patterns,
} from 'quasar';
import { useDocs } from 'src/composables/use-firestore';
import useVotingEvent from 'src/composables/use-voting-event';
import { getDb } from 'src/firebase';
import { showTheLoadingAndNotifyErrorAsync } from 'src/utils/ui';
import { computed } from 'vue';

interface Row {
  uid: string;
  displayName: string;
  role: string;
  type: 'user' | 'invitation';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const columns: QTableColumn<Row>[] = [
  {
    name: 'displayName',
    label: 'Nama',
    field: 'displayName',
    align: 'left',
    sortable: true,
    format: (v, row) => (row.type === 'user' ? v : `${v} (undangan)`),
    classes: (row: Row) => (row.type === 'invitation' ? 'text-grey-6 italic' : ''),
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
const invitationColl = computed(() => collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Invitation'));

const users = useDocs(userColl);
const invitations = useDocs(invitationColl);

const rows = computed(() => [
  ...users.value?.docs.map((val) => ({
    type: 'user',
    uid: val.id,
    displayName: val.data().displayName,
    role: val.data().role,
  } as Row)) ?? [],
  ...invitations.value?.docs.map((val) => ({
    uid: val.id,
    type: 'invitation',
    displayName: val.data().email,
    role: val.data().role,
  } as Row)) ?? [],
]);

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
    :rows
    row-key="uid"
    :pagination="{sortBy: 'displayName'}"
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
