<script lang="ts" setup>
import { Voter } from '@anhzf/evote-shared/models';
import DialogVoterCsvImporter from 'components/DialogVoterCsvImporter.vue';
import {
  collection, CollectionReference, getCountFromServer, getDocs, limit, orderBy, Query, query, QueryDocumentSnapshot, startAt, Timestamp, where,
} from 'firebase/firestore';
import TokenViewer from 'pages/voting-event/VoterVotingEvent/TokenViewer.vue';
import {
  Dialog, Notify, QTable, QTableColumn, QTableProps,
} from 'quasar';
import useVotingEvent from 'src/composables/use-voting-event';
import { getDb } from 'src/firebase';
import {
  computed, onMounted, reactive, ref,
} from 'vue';

interface FromSource {
    userId?: string;
    meta: Record<string, any>;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    deletedAt?: Timestamp;
}

const prependColumns: QTableColumn<Voter>[] = [
  {
    name: 'uid',
    label: '#ID',
    field: 'uid',
    sortable: false,
    align: 'left',
    classes: 'text-grey-8',
  },
];

const appendColumns: QTableColumn<Voter>[] = [
  {
    name: 'token',
    label: 'TOKEN',
    field: 'uid',
    sortable: false,
    align: 'right',
  },
];

const votingEvent = useVotingEvent();

const getVoterListCount = async (q: Query = collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Voter')) => {
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

const fromSource = (doc: QueryDocumentSnapshot<FromSource>): Voter => {
  const data = doc.data();
  return {
    ...data, createdAt: data.createdAt.toDate(), updatedAt: data.updatedAt?.toDate(), deletedAt: data.deletedAt?.toDate(), uid: doc.id,
  };
};

const buildQuery = (start = 0, search = '', sortBy = 'meta.NAMA', descending = false) => query(
    collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Voter') as CollectionReference<FromSource>,
    // Remove where filter if there's no search input
    ...(search ? [
      where(sortBy, '>=', search),
      where(sortBy, '<=', `${search}\uf8ff`),
    ] : []),
    orderBy(sortBy, descending ? 'desc' : 'asc'),
    startAt(start),
);

const selected = ref<Voter[]>([]);
const filter = ref('');
const table = ref<QTable>();
const pagination = ref<NonNullable<QTableProps['pagination']>>({
  sortBy: 'meta.NAMA',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const _ui = reactive({
  isLoading: false,
});

const rows = ref<Voter[]>([]);
const columns = computed<QTableColumn<Voter>[]>(() => [
  ...prependColumns,
  {
    name: 'meta.NAMA',
    label: 'NAMA',
    field: (r) => r.meta.NAMA,
    align: 'left',
  },
  {
    name: 'meta.KATEGORI',
    label: 'KATEGORI',
    field: (r) => r.meta.KATEGORI,
    align: 'left',
  },
  // TODO: Dynamic Key
  // ...Object.keys(voterList.value[0]?.meta || {}).map((k) => ({
  //   name: `meta.${k}`,
  //   label: k.toUpperCase(),
  //   field: (r) => (r.meta as Record<string, unknown>)[k],
  //   align: 'left',
  //   sortable: true,
  // } as QTableColumn<Voter>)),
  ...appendColumns,
]);

/**
 * TODO: Refactor to composables
 */
const onTableRequest: QTableProps['onRequest'] = async (req) => {
  _ui.isLoading = true;

  const {
    pagination: {
      descending, page, rowsPerPage, sortBy,
    },
    filter: search,
  } = req;

  const q = buildQuery(
    (page - 1) * rowsPerPage,
    search,
    sortBy,
    descending,
  );

  const [snapshot, count] = await Promise.all([
    getDocs(rowsPerPage ? query(q, limit(rowsPerPage)) : q),
    getVoterListCount(q),
  ]);

  const voters = snapshot.docs.map(fromSource);

  rows.value.splice(0, rows.value.length, ...voters);

  pagination.value = {
    page,
    rowsPerPage,
    sortBy,
    descending,
    rowsNumber: count,
  };

  _ui.isLoading = false;
};

const onImportCSVClick = () => {
  Dialog.create({
    component: DialogVoterCsvImporter,
  })
    .onOk(() => {
      table.value?.requestServerInteraction();
    });
};

const onDeleteClick = () => {
  Notify.create({
    message: 'Not implemented yet',
    color: 'negative',
  });
  throw new Error('Not implemented yet');
};

onMounted(() => {
  table.value?.requestServerInteraction();
});
</script>

<template>
  <q-page
    padding
    class="column justify-center items-center"
  >
    <q-table
      ref="table"
      v-model:selected="selected"
      v-model:pagination="pagination"
      title="Daftar pemilih"
      :columns="columns"
      :rows="rows"
      row-key="uid"
      selection="multiple"
      :filter="filter"
      :loading="_ui.isLoading"
      :rows-per-page-options="[10, 25, 50]"
      class="flex-grow max-h-80vh w-full max-w-7xl"
      @request="onTableRequest"
    >
      <template #top-right>
        <div class="row q-gutter-x-md">
          <q-input
            v-model="filter"
            label="Cari..."
            dense
            debounce="300"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            label="Impor CSV"
            outline
            @click="onImportCSVClick"
          />

          <!-- <q-btn
            label="Tambah"
            unelevated
            color="positive"
          /> -->

          <q-btn
            v-if="selected.length"
            label="Hapus"
            unelevated
            color="negative"
            @click="onDeleteClick"
          />
        </div>
      </template>

      <template #body-cell-token="props">
        <q-td :props="props">
          <div class="row justify-end q-gutter-x-sm">
            <TokenViewer :voter-id="props.value" />
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
