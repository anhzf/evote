import { setupIsServer } from '@anhzf/evote-shared';

export default defineNuxtPlugin({
  enforce: 'pre',
  setup: (nuxtApp) => {
    setupIsServer(() => nuxtApp.ssrContext !== undefined);
  },
});
