<template>
  <q-page
    padding
    class="column items-center"
  >
    <q-card
      class="w-full max-w-screen-xs"
      flat
      bordered
    >
      <q-card-section class="q-mb-lg">
        <h6 class="q-mb-sm">
          Terimakasih telah memilih,
        </h6>
        <span class="text-body1">{{ user?.displayName }}</span>
      </q-card-section>

      <q-card-actions>
        <q-btn
          label="Keluar"
          icon="logout"
          color="positive"
          @click="onClickExit"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/store/useAuthStore';
import { useUser } from 'src/use/useUser';
import { useAuthModule } from 'src/modules/Auth';
import { VotingEvent } from '~/shared/core';

const voting = inject<Ref<VotingEvent>>('VotingEvent')!;
const user = useUser('auth');
const router = useRouter();
const { onAuthenticating } = useAuthStore();

const { logout } = useAuthModule();

const onClickExit = async () => onAuthenticating(async () => {
  await logout();

  await router.push({ name: 'VotingEvent' });
});
</script>
