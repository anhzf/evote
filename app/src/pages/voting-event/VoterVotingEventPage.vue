<script lang="ts" setup>
import { HasSearchableFields, Voter } from '@anhzf/evote-shared/models';
import { arrayChunks, get } from '@anhzf/evote-shared/utils';
import DialogVoterCsvImporter from 'components/DialogVoterCsvImporter.vue';
import DialogAddVoter from 'components/DialogAddVoter.vue';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  CollectionReference,
  doc, getCountFromServer,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot, QueryFieldFilterConstraint, startAfter, Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  Dialog, Notify, QTable, QTableColumn, QTableProps, Loading,
} from 'quasar';
import TokenViewer from 'pages/voting-event/VoterVotingEvent/TokenViewer.vue';
import VoteToken from 'src/actions/vote-token';
import useVotingEvent from 'src/composables/use-voting-event';
import { FIREBASE_WRITE_LIMIT } from 'src/constants';
import { getDb } from 'src/firebase';
import {
  computed, onMounted, reactive, ref, watch,
} from 'vue';

interface FromSource extends HasSearchableFields {
    userId?: string;
    meta: Record<string, any>;
    isVoted: boolean;
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
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    deletedAt: data.deletedAt?.toDate(),
    uid: snapshot.id,
  };
};

const selected = ref<Voter[]>([]);
const isVoted = ref<boolean>();
const filter = ref('');
const filterTag = ref('');
const table = ref<QTable>();
const pagination = ref<NonNullable<QTableProps['pagination']>>({
  sortBy: 'meta.NAMA',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const _ui = reactive({
  isLoading: false,
  showedToken: 0,
});

const rows = ref<Voter[]>([]);
const columns = computed<QTableColumn<Voter>[]>(() => [
  ...prependColumns,
  {
    name: 'meta',
    label: 'LABEL',
    field: (r) => r.meta,
    align: 'left',
    headerClasses: 'w-5/8',
  },
  ...appendColumns,
]);

/**
 * TODO: Refactor to composables
 */
const onTableRequest: QTableProps['onRequest'] = async (req) => {
  const preConditions = [
    filterTag.value ? where('$search.tags', 'array-contains', filterTag.value) : null,
    typeof isVoted.value === 'boolean' ? where('isVoted', '==', isVoted.value) : null,
  ].filter(Boolean) as QueryFieldFilterConstraint[];

  const buildQuery = (start = 0, search = '', sortBy = 'meta.NAMA', descending = false) => {
    let q: Query<FromSource> = query(
      collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Voter') as CollectionReference<FromSource>,
      ...preConditions,
    );

    if (search) {
      q = query(q, where(sortBy, '>=', search), where(sortBy, '<=', `${search}\uf8ff`));
    }

    q = query(q, orderBy(sortBy, descending ? 'desc' : 'asc'));

    if (rows.value.at(-1)) {
      q = query(q, startAfter(get(rows.value.at(-1)!, sortBy)));
    }

    return q;
  };

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

  pagination.value = {
    page,
    rowsPerPage,
    sortBy,
    descending,
    rowsNumber: count,
  };

  _ui.isLoading = false;
};

const onTableVirtualScroll: QTableProps['onVirtualScroll'] = async () => {
  //
};

const onAddVoterClick = () => {
  Dialog.create({
    component: DialogAddVoter,
  }).onOk(() => {
    table.value?.requestServerInteraction();
  });
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

    selected.value = [];
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

watch([isVoted, filterTag], () => {
  table.value?.requestServerInteraction();
});

const exportTokens = async () => {
  Loading.show({ message: 'Mengekspor token pemilih...' });

  const xlsx = await import('xlsx');

  try {
    // Fetch all voters and tokens in parallel
    const voterCollectionRef = collection(getDb(), 'VotingEvent', votingEvent.value!.uid, 'Voter');
    const [votersSnapshot, tokensData] = await Promise.all([
      getDocs(voterCollectionRef),
      VoteToken.getAll({ votingEventId: votingEvent.value!.uid }),
    ]);

    // Convert voters to a map for easy lookup
    const votersMap = new Map<string, Voter>();
    votersSnapshot.docs.forEach((voterDoc) => {
      const voter = fromSource(voterDoc as QueryDocumentSnapshot<FromSource>);
      votersMap.set(voter.uid!, voter);
    });

    // Combine tokens with voter data
    const tokens = [...tokensData.tokens.created, ...tokensData.tokens.existing];
    const combinedData = tokens.map((token) => {
      const voterId = token.voter.split('/').pop() || '';
      const voter = votersMap.get(voterId);

      // Flatten meta fields
      const metaFields = voter?.meta || {};

      return {
        Token: token.uid,
        'Voter ID': voterId,
        'Is Voted': voter?.isVoted || false,
        'Voted At': token.voted ? (token.updatedAt?.toISOString() || '') : '',
        ...metaFields, // Spread flattened meta fields
        'Token Created At': token.createdAt.toISOString(),
        'Token Updated At': token.updatedAt?.toISOString() || '',
        // 'User ID': voter?.userId || '',
      };
    });

    const worksheet = xlsx.utils.json_to_sheet(combinedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Vote Tokens');

    xlsx.writeFile(workbook, `voting-event-${votingEvent.value!.uid}-vote-tokens.xlsx`);

    Notify.create({
      message: `Berhasil mengekspor ${combinedData.length} token pemilih`,
      color: 'positive',
    });
  } catch (error) {
    if (error instanceof FirebaseError) {
      Notify.create({
        message: error.message,
        color: 'negative',
      });
    }

    console.error(error);
  } finally {
    Loading.hide();
  }
};

const onAddVoterManuallyClick = () => {
  Dialog.create({
    component: DialogAddVoter,
    componentProps: {
      'v-on:refreshTable': console.log,
    },
  }).onOk(() => {
    table.value?.requestServerInteraction();
  });
};

const onExportClick = async () => {
  Dialog.create({
    title: 'Konfirmasi ekspor token pemilih',
    // eslint-disable-next-line max-len
    message: 'Dengan mengekspor Anda akan membuat token untuk setiap pemilih yang ada. Proses ini mungkin memakan waktu cukup lama jika jumlah pemilih banyak. Apakah Anda yakin ingin mengekspor token pemilih?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      exportTokens();
    });
};
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
      <template #top-left>
        <div class="row items-center gap-x-xs">
          <h6 class="m-0">
            Daftar Pemilih
          </h6>
          <q-btn
            type="button"
            icon="refresh"
            round
            flat
            @click="table?.requestServerInteraction()"
          />
        </div>
      </template>

      <template #top-right>
        <div class="row q-gutter-x-md items-center">
          <q-chip
            v-if="filterTag"
            size="0.7rem"
            clickable
            class="q-mx-none"
            @click="filterTag = ''"
          >
            <span>{{ filterTag.split(':').at(0) }}:</span>
            <strong>{{ filterTag.split(':').at(1) }}</strong>

            <q-icon
              name="close"
              class="ml-1 text-gray"
            />
          </q-chip>

          <q-checkbox
            v-model="isVoted"
            :label="isVoted === true ? 'Sudah memilih' : (isVoted === false ? 'Belum memilih' : 'Sudah dan belum memilih')"
            toggle-indeterminate
            left-label
          />

          <q-input
            v-model.trim.lazy="filter"
            label="Cari..."
            dense
            debounce="300"
            input-class="w-32ch"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn-dropdown
            label="Tambah"
            split
            icon="add"
            color="secondary"
            @click="onAddVoterClick"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="onImportCSVClick"
              >
                <q-item-section avatar>
                  <q-icon
                    name="upload_file"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Impor CSV</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="onAddVoterManuallyClick"
              >
                <q-item-section avatar>
                  <q-icon
                    name="person_add"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tambah Manual</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn
            label="Ekspor"
            unelevated
            icon="download"
            @click="onExportClick"
          />

          <q-btn
            v-if="selected.length"
            label="Hapus"
            unelevated
            color="negative"
            @click="onDeleteClick"
          />
        </div>
      </template>

      <template #body-cell-meta="props">
        <q-td :props="props">
          <div class="row items-center gap-x-0.5">
            <q-chip
              v-for="(label, key) in props.value"
              :key="key"
              size="0.7rem"
              clickable
              class="q-mx-none"
              @click="filterTag = `${key}:${label}`"
            >
              <span>{{ key }}: </span>
              <span class="font-semibold">{{ label }}</span>
            </q-chip>

            <q-icon
              name="check_circle"
              :color="props.row.isVoted ? 'positive' : 'grey'"
              size="1rem"
              class="ml-2"
            />
          </div>
        </q-td>
      </template>

      <template #body-cell-token="props">
        <q-td :props="props">
          <div class="row justify-end q-gutter-x-sm">
            <token-viewer
              :voter-id="props.value"
              :show-token="_ui.showedToken === props.rowIndex"
              @view-token="() => { _ui.showedToken = props.rowIndex; }"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
