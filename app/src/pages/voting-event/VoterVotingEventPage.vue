<script lang="ts" setup>
import { Voter, VotingEvent } from '@anhzf/evote-shared/models';
import { useAsyncState } from '@vueuse/core';
import DialogVoterCsvImporter from 'components/DialogVoterCsvImporter.vue';
import {
  collection, getCountFromServer, getDocs, orderBy, query, where,
} from 'firebase/firestore';
import { Dialog, QTableColumn, QTableProps } from 'quasar';
import { getDb } from 'src/firebase';
import {
  computed, inject, reactive, Ref, ref,
} from 'vue';

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

const votingEvent = inject<Ref<VotingEvent>>('voting-event')!;

const getVoterListCount = async () => {
  const snapshot = await getCountFromServer(collection(getDb(), 'VotingEvent', votingEvent.value.uid, 'Voter'));
  return snapshot.data().count;
};

const fetchVoterList = async (start: number, end: number, filter: string, sortBy = 'meta.NAMA', isDesc = false) => {
  const snapshot = await getDocs(
    query(
      collection(getDb(), 'VotingEvent', votingEvent.value.uid, 'Voter'),
      // where('meta.NAMA', '>=', filter),
      // where('meta.KATEGORI', '>=', filter),
      where(sortBy, '>=', filter),
      where(sortBy, '<=', `${filter}\uf8ff`),
      orderBy(sortBy, isDesc ? 'desc' : 'asc'),
    ),
  );
  return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id } as Voter));
};

const selected = ref<Voter[]>([]);
const filter = ref('');
const _ui = reactive({
  isLoading: false,
});

const { state: pagination, isLoading: isPaginationLoading } = useAsyncState<QTableProps['pagination']>(
  async () => ({
    sortBy: 'meta.NAMA',
    descending: false,
    page: 1,
    rowsPerPage: 0,
    rowsNumber: await getVoterListCount(),
  }),
  undefined,
);

const voterList = ref<Voter[]>([]);

const onTableRequest: QTableProps['onRequest'] = (async (reqProps) => {
  _ui.isLoading = true;

  const start = (reqProps.pagination.page - 1) * reqProps.pagination.rowsPerPage;
  const end = reqProps.pagination.page * reqProps.pagination.rowsPerPage;
  const terms = String(reqProps.filter);
  const isDesc = reqProps.pagination.descending;
  const { sortBy } = reqProps.pagination;

  voterList.value = await fetchVoterList(start, end, terms, sortBy, isDesc);

  if (pagination.value) {
    pagination.value = {
      ...reqProps.pagination,
      rowsNumber: voterList.value.length || await getVoterListCount(),
    };
  }

  _ui.isLoading = false;
});

const onImportCSVClick = () => {
  Dialog.create({
    component: DialogVoterCsvImporter,
    componentProps: { votingEventId: votingEvent.value.uid },
  });
};
</script>

<template>
  <q-page
    padding
    class="column"
  >
    <q-table
      v-model:selected="selected"
      v-model:pagination="pagination"
      title="Daftar pemilih"
      :columns="columns"
      :rows="voterList"
      row-key="id"
      selection="multiple"
      :filter="filter"
      :loading="isPaginationLoading || _ui.isLoading"
      class="flex-grow max-h-80vh"
      :no-data-label="`Tidak dapat menampilkan daftar untuk sementara. Terdapat ${pagination?.rowsNumber} pemilih yang terdaftar dalam database`"
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
          />-->

          <q-btn
            v-if="selected.length"
            label="Hapus"
            unelevated
            color="negative"
          />
        </div>
      </template>

      <template #body-cell-token="props">
        <q-td :props="props">
          <div class="row justify-end q-gutter-x-sm">
            <!-- <VoterListTokenView
              :voting-event-id="votingEvent.uid"
              :voter-id="props.value"
            /> -->
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
