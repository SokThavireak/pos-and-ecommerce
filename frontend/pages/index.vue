<template>
  <div class="flex-1 flex flex-col">
    <SiteHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-16 w-full">
      <!-- 1. Hero Section: Two-Column Bento Card -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
        <!-- Left Hero Card -->
        <div class="lg:col-span-7 bg-[var(--color-surface)] rounded-3xl p-8 sm:p-14 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
          <!-- Top Badge -->
          <div class="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-800 w-fit shadow-xs">
            <span class="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            Precision Formulations & Unified Retail
          </div>

          <!-- Headline -->
          <div class="space-y-4 my-8">
            <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
              Precision Materials For Considered Research
            </h1>
            <p class="text-neutral-600 text-base sm:text-lg max-w-lg font-light leading-relaxed">
              Synthesized with clinical purity standards. Verified batch documentation, immediate dispatch, and cross-channel inventory parity.
            </p>
          </div>

          <!-- CTAs & Avatar Trust Badge -->
          <div class="space-y-6 pt-2">
            <div class="flex flex-wrap items-center gap-3">
              <NuxtLink
                to="/shop"
                class="px-8 py-3.5 rounded-full bg-neutral-900 text-white font-medium text-sm hover:bg-black transition-all shadow-sm"
              >
                Explore Collection
              </NuxtLink>
              <button
                class="px-7 py-3.5 rounded-full bg-white/80 backdrop-blur-sm text-neutral-800 font-medium text-sm hover:bg-white transition-all border border-black/5"
              >
                High-Purity Standard
              </button>
            </div>

            <!-- Avatar trust proof -->
            <div class="flex items-center gap-3 pt-4 border-t border-black/5">
              <div class="flex -space-x-2">
                <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Avatar" />
                <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Avatar" />
                <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100" alt="Avatar" />
              </div>
              <p class="text-xs text-neutral-600 font-normal">
                Trusted by 4,200+ certified researchers and institutions worldwide.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Hero Card (Full-bleed product photography container) -->
        <div class="lg:col-span-5 bg-neutral-950 rounded-3xl overflow-hidden relative min-h-[420px] lg:min-h-full group">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200"
            alt="GHk-Cu Research Vial"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
            <span class="text-xs uppercase tracking-widest text-neutral-300 font-mono">Lot #8934500101</span>
            <p class="font-serif text-2xl font-normal mt-1">GHk-Cu 50mg Tripeptide</p>
            <p class="text-xs text-neutral-300 mt-1 font-mono">Purity: ≥ 99.4% by HPLC Analysis</p>
          </div>
        </div>

        <!-- Circular Floating Badge Bridging Center Gap -->
        <div class="hidden lg:flex absolute top-1/2 left-[58.33%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#141414] text-white p-2.5 items-center justify-center shadow-xl border-4 border-[#fcfcfc] z-10 transition-transform hover:scale-110">
          <div class="relative w-full h-full flex items-center justify-center text-center">
            <svg class="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
              <path id="circlePath" fill="none" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              <text class="text-[9.5px] uppercase tracking-[0.25em] fill-neutral-300">
                <textPath xlink:href="#circlePath">
                  VERIFIED PURITY • BATCH 2026 •
                </textPath>
              </text>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-5 h-5 text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Featured Collection Carousel / Grid -->
      <section class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Curated Materials</span>
            <h2 class="font-serif text-3xl font-medium text-neutral-900 mt-1">Featured Research Collection</h2>
            <p class="text-sm text-neutral-500 font-light mt-1">A focused selection of molecules and essentials with clinical clarity.</p>
          </div>
          <NuxtLink
            to="/shop"
            class="inline-flex items-center gap-2 text-xs font-medium text-neutral-800 hover:text-black border border-neutral-200 px-4 py-2 rounded-full hover:border-black transition-colors"
          >
            View All Products
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="group bg-white border border-black/5 rounded-3xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
          >
            <!-- Image Card with Heart -->
            <div class="relative bg-[var(--color-surface)] rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6">
              <img
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <button
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-white shadow-xs transition-colors"
                aria-label="Wishlist"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <!-- Details -->
            <div class="pt-4 flex items-start justify-between gap-2">
              <div class="space-y-0.5">
                <h3 class="font-medium text-sm text-neutral-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                  {{ product.name }}
                </h3>
                <p class="text-xs text-neutral-500 font-mono">{{ product.spec }}</p>
              </div>
              <div class="text-right">
                <span class="font-semibold text-sm text-neutral-900">${{ product.price.toFixed(2) }}</span>
                <span v-if="product.oldPrice" class="block text-[11px] text-neutral-400 line-through">
                  ${{ product.oldPrice.toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Quick Add Button -->
            <button
              @click="addToCart(product)"
              class="mt-4 w-full py-2.5 rounded-full text-xs font-medium bg-neutral-900 text-white hover:bg-[var(--color-primary)] transition-colors flex items-center justify-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <!-- 3. Interactive Product Spotlight (Split Accordion Section) -->
      <section class="bg-white border border-black/5 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Left Split Image -->
        <div class="lg:col-span-5 bg-[var(--color-surface)] rounded-2xl overflow-hidden aspect-square relative flex items-center justify-center p-8">
          <img
            src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800"
            alt="NAD+ Spotlight Vial"
            class="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>

        <!-- Right Specification Accordions -->
        <div class="lg:col-span-7 space-y-6">
          <div class="space-y-2">
            <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold font-mono">SPECIFICATION BREAKDOWN</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900">
              Read the vial. Know the material.
            </h2>
            <p class="text-sm text-neutral-500 leading-relaxed font-light">
              Every production lot undergoes independent mass spectrometry verification and analytical purity assurance before catalog listing.
            </p>
          </div>

          <!-- Interactive Accordions -->
          <div class="divide-y divide-black/5 border-y border-black/5">
            <div
              v-for="(item, index) in accordions"
              :key="index"
              class="py-4 cursor-pointer"
              @click="toggleAccordion(index)"
            >
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-medium text-neutral-900">{{ item.title }}</h4>
                <span class="text-neutral-500 text-base font-mono">
                  {{ openAccordion === index ? '−' : '+' }}
                </span>
              </div>
              <p
                v-if="openAccordion === index"
                class="pt-2 text-xs text-neutral-600 leading-relaxed transition-all"
              >
                {{ item.content }}
              </p>
            </div>
          </div>

          <div class="pt-2">
            <NuxtLink
              to="/shop"
              class="inline-flex px-8 py-3.5 rounded-full bg-neutral-950 text-white font-medium text-sm hover:bg-[var(--color-primary)] transition-all shadow-sm"
            >
              View Analytical Batch Catalog
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 4. Video & FAQ Section -->
      <section class="space-y-12">
        <!-- Rounded Video Preview Banner -->
        <div class="relative bg-neutral-900 rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[420px] flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1400"
            alt="Synthesis Video Preview"
            class="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div class="relative z-10 flex flex-col items-center text-center p-6 max-w-lg space-y-4">
            <!-- Frosted Glass Play Button -->
            <button
              class="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
              aria-label="Play Laboratory Video"
            >
              <svg class="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <h3 class="text-white font-serif text-2xl sm:text-3xl font-normal">
              Small structures. Bigger questions.
            </h3>
            <p class="text-xs text-neutral-300 font-light">
              Look inside our cold-synthesis process and automated sterility checks.
            </p>
          </div>
        </div>

        <!-- Two-column bottom section: Left FAQ, Right Newsletter Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left FAQ List -->
          <div class="lg:col-span-7 bg-white border border-black/5 rounded-3xl p-8 space-y-6">
            <div class="space-y-1">
              <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold font-mono">HERE TO HELP</span>
              <h3 class="font-serif text-2xl font-medium text-neutral-900">Research information, made clearer.</h3>
            </div>

            <div class="divide-y divide-black/5">
              <div
                v-for="(faq, fIndex) in faqs"
                :key="fIndex"
                class="py-4 cursor-pointer"
                @click="toggleFaq(fIndex)"
              >
                <div class="flex items-center justify-between text-sm font-medium text-neutral-900">
                  <span>{{ faq.q }}</span>
                  <span class="text-neutral-400 font-mono">{{ activeFaq === fIndex ? '−' : '+' }}</span>
                </div>
                <p v-if="activeFaq === fIndex" class="pt-2 text-xs text-neutral-600 leading-relaxed">
                  {{ faq.a }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Newsletter Subscription Bento Card -->
          <div class="lg:col-span-5 bg-[var(--color-surface)] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div class="space-y-3">
              <div class="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[var(--color-primary)]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-serif text-2xl font-medium text-neutral-900">Notes from the lab.</h3>
              <p class="text-xs text-neutral-600 leading-relaxed font-light">
                Receive curated updates on novel peptide research, retail availability, and batch testing metrics.
              </p>
            </div>

            <div class="space-y-2">
              <input
                type="email"
                placeholder="Institutional or private email"
                class="w-full bg-white border border-black/10 rounded-full px-5 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                class="w-full py-3 rounded-full bg-neutral-950 text-white font-medium text-xs hover:bg-[var(--color-primary)] transition-colors"
              >
                Subscribe To Dispatch
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const featuredProducts = [
  {
    id: 'PEP-GHKCU-50',
    name: 'GHk-Cu 50mg Research Vial',
    sku: 'PEP-GHKCU-50',
    spec: '50mg Lyophilized',
    price: 65.00,
    oldPrice: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
  },
  {
    id: 'PEP-NAD-500',
    name: 'NAD+ 500mg Cellular Vial',
    sku: 'PEP-NAD-500',
    spec: '500mg Pure Grade',
    price: 95.00,
    oldPrice: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500',
  },
  {
    id: 'PEP-BPC157-10',
    name: 'BPC-157 Regenerative Formula',
    sku: 'PEP-BPC157-10',
    spec: '10mg Bio-Active',
    price: 52.00,
    oldPrice: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500',
  },
  {
    id: 'ACC-BAG-01',
    name: 'Small Travel Leather Barrel Bag',
    sku: 'ACC-BAG-01',
    spec: 'Cognac Saddle Leather',
    price: 185.00,
    oldPrice: 220.00,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
  },
];

const accordions = [
  {
    title: 'Start with the chemistry',
    content: 'Each batch is synthesized in an ISO-certified cleanroom environment with full mass-spectrometry certification.',
  },
  {
    title: 'Check the stated quantity',
    content: 'Exact lyophilized microgram weights verified by calibrated analytical scales before vacuum containment.',
  },
  {
    title: 'Connect it to a batch',
    content: 'Every single vial carries a unique QR/Barcode linkable to its digital certificate of analysis (COA).',
  },
];

const openAccordion = ref<number | null>(0);
const toggleAccordion = (index: number) => {
  openAccordion.value = openAccordion.value === index ? null : index;
};

const faqs = [
  {
    q: 'What is your precision cold-chain protocol?',
    a: 'All peptides and active compounds are stored at -20°C and dispatched with insulated temperature monitors.',
  },
  {
    q: 'Where are the COAs and HPLC reports accessible?',
    a: 'Every order receipt or scanned POS ticket includes an instant batch COA link available in our verification database.',
  },
  {
    q: 'Do you offer instant POS retail counter pickup?',
    a: 'Yes, our unified inventory system enables live in-store cashier dispatch with real-time stock deductions.',
  },
];

const activeFaq = ref<number | null>(0);
const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const addToCart = (product: any) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    imageUrl: product.imageUrl,
    spec: product.spec,
  });
};
</script>
