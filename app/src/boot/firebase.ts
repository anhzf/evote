import { boot } from 'quasar/wrappers';
import firebase from 'src/firebase';
import { VueFire, VueFireAuth } from 'vuefire';

export default boot(({ app }) => {
  app.use(VueFire, {
    firebaseApp: firebase,
    modules: [
      VueFireAuth(),
    ],
  });
});
