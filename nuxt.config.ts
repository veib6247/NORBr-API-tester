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
          src: 'https://provided_name/s/${merchant_id}/dNfsXe.js',
          async: 'true',
        },
      ],
    },

    keepalive: true,
  },
  colorMode: {
    preference: 'light',
  },
})
