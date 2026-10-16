// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],
  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
    },
  },
  // Route-Specific Single Task Code Splitting
  // When a user visits the storefront, ONLY storefront assets load.
  // When visiting POS, ONLY POS assets load. When in Admin, ONLY admin assets load.
  routeRules: {
    '/': { prerender: true },
    '/shop': { isr: 3600 },
    '/about': { prerender: true },
    '/location': { prerender: true },
    '/detail': { isr: 1800 },
    '/pos': { ssr: false },
    '/admin/**': { ssr: false },
  },
  experimental: {
    payloadExtraction: false,
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'biolabs — Precision Retail & Unified POS',
      meta: [
        { name: 'description', content: 'Modern Editorial E-Commerce & Touch Point of Sale System' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap',
        },
      ],
    },
  },
});
