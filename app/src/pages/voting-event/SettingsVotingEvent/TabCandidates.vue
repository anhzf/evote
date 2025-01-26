<script lang="ts" setup>
import votable from 'actions/votable';
import AsyncState from 'components/AsyncState.vue';
import DialogFields from 'components/DialogFields.vue';
import InputFile from 'components/InputFile.vue';
import {
  Dialog,
  QBtn, QImg, QInput, QTableColumn,
} from 'quasar';
import { useVotableList } from 'src/composables/use-votable';
import useVotingEvent from 'src/composables/use-voting-event';
import { assetUrl } from 'src/utils/asset-url';
import { showTheLoadingAndNotifyErrorAsync } from 'src/utils/ui';
import { h, ref, watch } from 'vue';
import { Votable } from '~/packages/shared/models';

const CANDIDATE_FIELDS_EMPTY = {
  title: '',
  subtitle: '',
  img: null as File | string | null,
};

const columns: QTableColumn<Votable>[] = [
  {
    name: 'title',
    label: 'Nama',
    field: 'title',
    align: 'left',
  },
  {
    name: '$actions',
    label: '',
    field: 'uid',
    align: 'right',
  },
];

const votingEvent = useVotingEvent();
const votables = useVotableList();

const candidateFields = ref(CANDIDATE_FIELDS_EMPTY);

const showCandidateDialog = (title: string) => Dialog.create({
  component: DialogFields,
  componentProps: {
    title,
    fields: [
      {
        name: 'title',
        field: () => [
          h('div', { class: 'flex justify-center items-center gap-4 flex-nowrap mb-2' }, [
            h(AsyncState, {
              value: assetUrl(candidateFields.value.img),
              init: '',
            }, {
              default: ({ state }: { state: string }) => h(QImg, {
                src: state,
                ratio: 4 / 3,
                class: 'shrink-1',
              }),
            }),
            // h(QImg, {
            //   src: candidateFields.value.img
            //     ? (typeof candidateFields.value.img !== 'string'
            //       ? URL.createObjectURL(candidateFields.value.img) : candidateFields.value.img)
            //     // eslint-disable-next-line max-len
            //     : 'data:image/png;base64,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',
            //   ratio: 4 / 3,
            //   class: 'shrink-1',
            // }),
            h(QBtn, {
              icon: 'edit',
              flat: true,
              round: true,
              class: 'self-start',
            }, () => [
              h(InputFile, {
                modelValue: typeof candidateFields.value.img === 'string'
                  // TODO: Don't automatically infer as png
                  ? new File([candidateFields.value.img], 'img.png', { type: 'image/png' })
                  : candidateFields.value.img,
                'onUpdate:modelValue': (val: File | null) => { candidateFields.value.img = val; },
              }),
            ]),
          ]),
          h(QInput, {
            label: 'Nama',
            modelValue: candidateFields.value.title,
            type: 'text',
            'onUpdate:modelValue': (val: string) => { candidateFields.value.title = val; },
          }),
          h(QInput, {
            label: 'Subtitle',
            modelValue: candidateFields.value.subtitle,
            type: 'text',
            'onUpdate:modelValue': (val: string) => { candidateFields.value.subtitle = val; },
          }),
        ],
      },
    ],
    actions: {
      label: 'Simpan',
      color: 'primary',
    },
  },
});

const onAddCandidateClick = () => {
  candidateFields.value = CANDIDATE_FIELDS_EMPTY;

  showCandidateDialog('Tambahkan Kandidat')
    .onOk(() => showTheLoadingAndNotifyErrorAsync(
      () => votable.create({
        ...candidateFields.value,
        votingEventId: votingEvent.value!.uid,
        img: typeof candidateFields.value.img === 'string'
          // TODO: Don't automatically infer as png
          ? new File([candidateFields.value.img], 'img.png', { type: 'image/png' })
          : candidateFields.value.img,
      }),
    ));
};

const onEditClick = (item: Votable) => {
  candidateFields.value = {
    title: item.title,
    subtitle: item.subtitle,
    img: item.thumbnailSrc ?? null,
  };

  showCandidateDialog('Lihat/Perbarui Kandidat')
    .onOk(() => showTheLoadingAndNotifyErrorAsync(
      () => votable.update({
        ...candidateFields,
        img: typeof candidateFields.value.img === 'string'
          // TODO: Don't automatically infer as png
          ? new File([candidateFields.value.img], 'img.png', { type: 'image/png' })
          : candidateFields.value.img,
        votingEventId: votingEvent.value!.uid,
        uid: item.uid,
      }),
    ));
};

const onSetOrderClick = (uid: string, to: 'up' | 'down') => {
  //
};

watch(votables, (curr, prev) => {
  console.log({ curr, prev });
}/* , { immediate: true } */);
</script>

<template>
  <q-card>
    <q-table
      :columns
      :rows="votables"
    >
      <template #top>
        <q-space />
        <q-btn
          label="Kandidat"
          icon="add"
          color="primary"
          @click="onAddCandidateClick"
        />
      </template>

      <template #body-cell-title="props">
        <q-td :props>
          <div class="flex gap-4">
            <div class="flex flex-col">
              <q-btn
                icon="keyboard_arrow_up"
                :disable="props.rowIndex === 0"
                round
                flat
                dense
                :color="props.rowIndex === 0 ? 'grey' : 'black'"
                @click="onSetOrderClick(props.key, 'up')"
              />
              <q-btn
                icon="keyboard_arrow_down"
                :disable="props.rowIndex === votables.length - 1"
                round
                flat
                dense
                :color="props.rowIndex === votables.length - 1 ? 'grey' : 'black'"
                @click="onSetOrderClick(props.key, 'down')"
              />
            </div>
            <async-state
              :value="assetUrl(props.row.thumbnailSrc)"
              init=""
              #="{state: srcUrl}"
            >
              <q-img
                :src="srcUrl"
                height="60px"
                width="80px"
              />
            </async-state>
            <div class="flex flex-col justify-center">
              <div class="text-bold">
                {{ props.row.title }}
              </div>
              <div class="text-grey">
                {{ props.row.subtitle }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-$actions="props">
        <q-td :props>
          <q-btn
            icon="edit"
            flat
            round
            size="sm"
            @click="onEditClick(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>
