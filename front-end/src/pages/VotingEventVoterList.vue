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
      :loading="isPaginationLoading || UIState.isLoading"
      class="flex-grow"
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
            <VoterListTokenView
              :voting-event-id="voting.id"
              :voter-id="props.value"
            />
          </div>
        </q-td>
      </template>
    </q-table>

    <q-inner-loading :showing="isUserPrivilegeLoading" />
  </q-page>
</template>

<script lang="ts" setup>
import {
  ref, reactive, computed, inject, Ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, QTableColumn, QTableProps } from 'quasar';
import DialogVoterCSVDataImport from 'src/components/DialogVoterCSVDataImport.vue';
import VoterListTokenView from 'src/components/VotingEvent/VoterListTokenView.vue';
import { useUserPrivilege } from 'src/use/useUserPrivilege';
import { useUser } from 'src/use/useUser';
import { useAsyncState } from '@vueuse/core';
import { fetchVoterList, getVoterListCount } from 'src/modules/Voter';
import { Voter, VotingEvent } from '~/shared/core';

useUser('auth');

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const router = useRouter();

const { isLoading: isUserPrivilegeLoading, is } = useUserPrivilege(
  voting.value,
  () => is('OWNER') || is('ADMIN'),
  () => router.push({ name: 'VotingEvent', params: { votingEventName: voting.value.url } }),
);

const prependColumns: QTableColumn<Voter>[] = [
  {
    name: 'id',
    label: '#ID',
    field: 'id',
    sortable: false,
    align: 'left',
    classes: 'text-grey-8',
  },
];

const appendColumns: QTableColumn<Voter>[] = [{
  name: 'token',
  label: 'TOKEN',
  field: 'id',
  sortable: false,
  align: 'right',
}];

const selected = ref([]) as Ref<Voter[]>;
const filter = ref('');
const UIState = reactive({
  isLoading: false,
});

const { state: pagination, isLoading: isPaginationLoading } = useAsyncState<QTableProps['pagination']>(
  async () => ({
    sortBy: 'meta.KATEGORI',
    descending: false,
    page: 1,
    rowsPerPage: 0,
    rowsNumber: await getVoterListCount(voting.value.id),
  }),
  undefined,
);

const voterList = ref([]) as Ref<Voter[]>;

const columns = computed(() => [
  ...prependColumns,
  {
    name: 'meta.NAMA',
    label: 'NAMA',
    field: (r) => (r.meta as Record<string, unknown>).NAMA as string,
    align: 'left',
  },
  {
    name: 'meta.KATEGORI',
    label: 'KATEGORI',
    field: (r) => (r.meta as Record<string, unknown>).KATEGORI as string,
    align: 'left',
  },
  // Soon Feature
  // ...Object.keys(voterList.value[0]?.meta || {}).map((k) => ({
  //   name: `meta.${k}`,
  //   label: k.toUpperCase(),
  //   field: (r) => (r.meta as Record<string, unknown>)[k],
  //   align: 'left',
  //   sortable: true,
  // } as QTableColumn<Voter>)),
  ...appendColumns,
] as QTableColumn<Voter>[]);

const onTableRequest: QTableProps['onRequest'] = (async (reqProps) => {
  UIState.isLoading = true;

  const start = (reqProps.pagination.page - 1) * reqProps.pagination.rowsPerPage;
  const end = reqProps.pagination.page * reqProps.pagination.rowsPerPage;
  const terms = String(reqProps.filter);
  const orderBy = reqProps.pagination.sortBy;
  const isDesc = reqProps.pagination.descending;

  voterList.value = await fetchVoterList(voting.value.id, start, end, terms, orderBy, isDesc);

  if (pagination.value) {
    pagination.value = {
      ...reqProps.pagination,
      rowsNumber: voterList.value.length || await getVoterListCount(voting.value.id),
    };
  }

  UIState.isLoading = false;
});

const onImportCSVClick = () => {
  Dialog.create({
    component: DialogVoterCSVDataImport,
    componentProps: { votingEventId: voting.value.id },
  });
};
</script>
