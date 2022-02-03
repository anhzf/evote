import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: { fullscreen: true },
      },
      {
        path: 'events',
        name: 'VotingEvents',
        component: () => import('pages/VotingEventList.vue'),
      },
      {
        path: 'settings',
        name: 'AccountSettings',
        component: () => import('pages/AccountSettings.vue'),
      },
    ],
  },
  {
    path: '/:votingEventName',
    component: () => import('layouts/VotingEventLayout.vue'),
    children: [
      {
        path: '',
        name: 'VotingEvent',
        component: () => import('pages/VotingEvent.vue'),
        meta: { fullscreen: true },
      },
      {
        path: 'result',
        name: 'VotingEvent_Result',
        component: () => import('pages/VotingEventResult.vue'),
      },
      {
        path: 'vote',
        name: 'VotingEvent_Vote',
        component: () => import('pages/Vote.vue'),
      },
      {
        path: 'vote/finish',
        name: 'VotingEvent_VoteFinish',
        component: () => import('pages/VoteFinish.vue'),
      },
      {
        path: 'voter',
        name: 'VotingEvent_Voter',
        component: () => import('pages/VotingEventVoterList.vue'),
      },
      {
        path: 'settings',
        name: 'VotingEvent_Settings',
        component: () => import('pages/VotingEventSettings.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
