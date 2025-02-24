// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@nuxt/ui'],
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
          href: 'https://secure-assets-sandbox.norbr.io/stylesheet/1.9/norbr-client.min.css',
        },
      ],
      script: [
        // NORBr JS
        {
          src: 'https://secure-assets-sandbox.norbr.io/javascript/1.9/norbr-client.min.js',
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
    preference: 'light',
  },
})
