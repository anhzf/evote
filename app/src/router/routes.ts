import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('pages/IndexPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/:votingEventName',
    component: () => import('layouts/VotingEventLayout.vue'),
    children: [
      {
        path: '',
        name: 'VotingEvent',
        component: () => import('pages/voting-event/HomeVotingEventPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'vote',
        name: 'VotingEvent-Vote',
        component: () => import('pages/voting-event/VoteVotingEventPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'results',
        name: 'VotingEvent-Results',
        component: () => import('pages/voting-event/ResultsVotingEventPage.vue'),
      },
      {
        path: 'voter',
        name: 'VotingEvent-Voter',
        component: () => import('pages/voting-event/VoterVotingEventPage.vue'),
      },
      {
        path: 'settings',
        name: 'VotingEvent-Settings',
        component: () => import('pages/voting-event/SettingsVotingEvent/IndexPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
