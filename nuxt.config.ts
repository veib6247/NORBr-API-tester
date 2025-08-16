// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@nuxt/ui', '@sentry/nuxt/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      link: [
        // NORBr CSS
        {
          rel: 'stylesheet',
          href: 'https://secure-assets-sandbox.norbr.io/stylesheet/2.3/norbr-client.min.css',
        },
      ],
      script: [
        // Umami for tracking
        {
          defer: true,
          src: 'https://umami.bryisdoinghisbest.com/script.js',
          'data-website-id': '069485b7-64d8-4621-9060-29083b094903',
        },

        // NORBr JS
        {
          src: 'https://secure-assets-sandbox.norbr.io/javascript/2.3/norbr-client.min.js',
        },

        // Nethone JS
        {
          type: 'text/javascript',
          id: 'nethone_script',
          crossorigin: 'use-credentials',
          src: 'https://d2g3ekl4mwm40k.cloudfront.net/s/182619/digcSw.js',
          async: 'true',
        },

        // SEON JS
        {
          type: 'text/javascript',
          src: 'https://cdn.seondf.com/js/v6/agent.umd.js',
        },
        {
          type: 'text/javascript',
          src: 'https://cdn.deviceinf.com/js/v6/agent.umd.js',
        },
        {
          type: 'text/javascript',
          src: 'https://cdn.seonintelligence.com/js/v6/agent.umd.js',
        },
      ],
    },

    keepalive: true,
  },

  colorMode: {
    preference: 'dark',
  },

  // auto-import types
  imports: {
    dirs: ['types/**'],
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'cognito-inc',
      project: 'norbr-api-tester',
    },

    autoInjectServerSentry: 'top-level-import',
  },

  sourcemap: {
    client: 'hidden',
  },
})
