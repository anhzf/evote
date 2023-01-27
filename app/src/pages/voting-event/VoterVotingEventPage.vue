<script lang="ts" setup>
import { Voter } from '@anhzf/evote-shared/models';
import { arrayChunks } from 'app/../packages/shared/utils';
import DialogVoterCsvImporter from 'components/DialogVoterCsvImporter.vue';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  CollectionReference,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAt,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import TokenViewer from 'pages/voting-event/VoterVotingEvent/TokenViewer.vue';
import {
  Dialog, Notify, QTable, QTableColumn, QTableProps,
} from 'quasar';
import useVotingEvent from 'src/composables/use-voting-event';
import { FIREBASE_WRITE_LIMIT } from 'src/constants';
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

const fromSource = (snapshot: QueryDocumentSnapshot<FromSource>): Voter => {
  const data = snapshot.data();
  return {
    ...data, createdAt: data.createdAt.toDate(), updatedAt: data.updatedAt?.toDate(), deletedAt: data.deletedAt?.toDate(), uid: snapshot.id,
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

  rows.value = snapshot.docs.map(fromSource);

  // rows.value.splice(0, rows.value.length, ...voters);

  debugger;

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

const onDeleteClick = async () => {
  _ui.isLoading = true;

  try {
    const db = getDb();
    const chunks = arrayChunks(selected.value, FIREBASE_WRITE_LIMIT);
    const voterCollectionRef = collection(db, 'VotingEvent', votingEvent.value!.uid, 'Voter') as CollectionReference<Voter>;

    await Promise.all(chunks.map((chunk) => {
      const batch = writeBatch(db);

      chunk.forEach(({ uid }) => {
        const docRef = uid ? doc(voterCollectionRef, uid) : doc(voterCollectionRef);
        batch.delete(docRef);
      });

      return batch.commit();
    }));

    Notify.create({
      message: 'Berhasil menghapus pemilih',
      color: 'positive',
    });

    table.value?.requestServerInteraction();
  } catch (error) {
    if (error instanceof FirebaseError) {
      Notify.create({
        message: error.message,
        color: 'negative',
      });
    }

    console.error(error);
  } finally {
    _ui.isLoading = false;
  }
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
