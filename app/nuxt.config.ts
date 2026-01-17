export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      firebase: {
        config: JSON.parse(import.meta.env.FIREBASE_CONFIG),
      },
    }
  },
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2026-01-16',
  experimental: {
    componentIslands: {
      selectiveClient: true,
    },
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
  },
  app: {
    head: {
      titleTemplate: '%s | Evote',
      // titleTemplate: '%s %separator %siteName',
      // templateParams: {
      //   siteName: 'Evote',
      //   separator: ' - ',
      // },
      htmlAttrs: {
        lang: 'id',
      },
      link: [
      ],
      meta: [
        { name: 'description', content: 'Online Election App' },
      ],
    },
  },
});
