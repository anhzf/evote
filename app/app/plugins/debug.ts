export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (err) => {
    console.error('App Error:', err);
  });
  nuxtApp.hook('vue:error', (err) => {
    console.error('Vue Error:', err);
  });
});
