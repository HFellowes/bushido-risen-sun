import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4,
  },

  serverDir: 'server',

  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  runtimeConfig: {
    dbPath: process.env.DB_PATH || './data/bushido.db',
    public: {
      appName: 'Bushido Risen Sun',
    },
  },

  icon: {
    serverBundle: {
      collections: ['ph', 'lucide'],
    },
  },

  image: {
    domains: ['gctstudios.com', 'cdn.shopify.com'],
  },
})
