import { createHead } from '@vueuse/head';
import { boot } from 'quasar/wrappers';

const head = createHead();

export default boot(({ app }) => {
  app.use(head);
});
