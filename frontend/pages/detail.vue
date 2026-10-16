<template>
  <div class="flex-1 flex flex-col">
    <SiteHeader />

    <!-- Breadcrumb Subheader -->
    <section class="w-full bg-[#f4f5f7] border-b border-black/5 py-8">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/shop" class="hover:text-black">Shop</NuxtLink>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">{{ product.name }}</span>
        </div>
      </div>
    </section>

    <!-- Main Product Detail Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-16">
      <!-- Top Section: Image Gallery (Left) & Purchasing Info (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Left: Image Showcase with Zoom/Thumbnail Preview -->
        <div class="lg:col-span-6 space-y-4">
          <div class="aspect-square bg-[var(--color-surface)] rounded-3xl overflow-hidden p-10 flex items-center justify-center relative border border-black/5 shadow-xs">
            <img
              :src="activeImage"
              :alt="product.name"
              class="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
            />
            <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[11px] font-mono font-semibold px-3 py-1 rounded-full text-neutral-800 shadow-xs">
              {{ product.spec }}
            </span>
            <button
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-600 hover:text-red-500 shadow-xs transition-colors"
              aria-label="Wishlist"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <!-- Thumbnails -->
          <div class="flex items-center gap-3">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              @click="activeImage = img"
              class="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 border-2 transition-all p-2 flex items-center justify-center"
              :class="activeImage === img ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-neutral-300'"
            >
              <img :src="img" :alt="product.name" class="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        <!-- Right: Purchasing & Stock Details -->
        <div class="lg:col-span-6 space-y-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-mono font-semibold">
                {{ product.category }}
              </span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs font-mono text-neutral-500">SKU: {{ product.sku }}</span>
              <span class="text-neutral-300">•</span>
              <span class="text-xs font-mono text-neutral-500">Barcode: {{ product.barcode }}</span>
            </div>

            <h1 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900 leading-tight">
              {{ product.name }}
            </h1>

            <!-- Rating & In-Store Availability Badge -->
            <div class="flex flex-wrap items-center gap-4 pt-1">
              <div class="flex items-center gap-1 text-amber-400">
                <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-xs text-neutral-500 font-mono font-semibold ml-1">4.9 / 5.0 (42 verified reviews)</span>
              </div>

              <span class="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ product.stock }} units ready across POS counters
              </span>
            </div>
          </div>

          <!-- Price & Old Price -->
          <div class="flex items-baseline gap-3 py-3 border-y border-black/5">
            <span class="text-3xl font-bold font-mono text-neutral-900">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.oldPrice" class="text-base text-neutral-400 line-through font-mono">
              ${{ product.oldPrice.toFixed(2) }}
            </span>
            <span v-if="product.oldPrice" class="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Save {{ Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) }}%
            </span>
          </div>

          <!-- Description -->
          <p class="text-sm text-neutral-600 leading-relaxed font-light">
            {{ product.description }}
          </p>

          <!-- Dosage / Spec Options -->
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
              Available Formulations / Sizes
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in product.specOptions"
                :key="opt"
                @click="selectedSpec = opt"
                class="px-4 py-2 rounded-xl text-xs font-mono transition-all border"
                :class="selectedSpec === opt ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'"
              >
                {{ opt }}
              </button>
            </div>
          </div>

          <!-- Quantity & Action CTAs -->
          <div class="space-y-4 pt-2">
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-neutral-300 rounded-full px-4 py-2 gap-3 bg-white">
                <button @click="quantity = Math.max(1, quantity - 1)" class="text-neutral-500 hover:text-black font-bold">
                  −
                </button>
                <span class="w-8 text-center font-mono font-semibold text-xs">{{ quantity }}</span>
                <button @click="quantity++" class="text-neutral-500 hover:text-black font-bold">
                  +
                </button>
              </div>

              <button
                @click="addToCart"
                class="flex-1 py-3.5 rounded-full bg-neutral-950 text-white font-semibold text-xs hover:bg-[var(--color-primary)] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add {{ quantity }} to Cart • ${{ (product.price * quantity).toFixed(2) }}
              </button>
            </div>

            <!-- Instant In-Store POS Pickup Option -->
            <NuxtLink
              to="/location"
              class="block w-full py-3 rounded-full text-center border border-neutral-300 text-xs font-medium text-neutral-800 hover:border-black transition-colors"
            >
              📍 Check In-Store Pickup Locations & POS Counters
            </NuxtLink>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-3 gap-3 pt-4 border-t border-black/5 text-center text-[11px] text-neutral-600 font-mono">
            <div class="p-3 bg-neutral-50 rounded-2xl">
              <p class="font-bold text-neutral-900">Cold Chain</p>
              <p class="text-[10px] text-neutral-400 mt-0.5">Dispatched at -20°C</p>
            </div>
            <div class="p-3 bg-neutral-50 rounded-2xl">
              <p class="font-bold text-neutral-900">HPLC Certified</p>
              <p class="text-[10px] text-neutral-400 mt-0.5">≥ 99.4% Purity Verified</p>
            </div>
            <div class="p-3 bg-neutral-50 rounded-2xl">
              <p class="font-bold text-neutral-900">Instant POS</p>
              <p class="text-[10px] text-neutral-400 mt-0.5">Counter Pick Ready</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Specification Tabs: COA Batch Data, Storage, and Protocol -->
      <section class="bg-white border border-black/5 rounded-3xl p-8 sm:p-10 space-y-6">
        <div class="flex items-center gap-6 border-b border-black/5 pb-4">
          <button
            @click="activeTab = 'spec'"
            class="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 font-mono transition-colors"
            :class="activeTab === 'spec' ? 'border-[var(--color-primary)] text-neutral-900' : 'border-transparent text-neutral-400 hover:text-black'"
          >
            Technical Specifications
          </button>
          <button
            @click="activeTab = 'coa'"
            class="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 font-mono transition-colors"
            :class="activeTab === 'coa' ? 'border-[var(--color-primary)] text-neutral-900' : 'border-transparent text-neutral-400 hover:text-black'"
          >
            Certificate of Analysis (COA)
          </button>
          <button
            @click="activeTab = 'shipping'"
            class="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 font-mono transition-colors"
            :class="activeTab === 'shipping' ? 'border-[var(--color-primary)] text-neutral-900' : 'border-transparent text-neutral-400 hover:text-black'"
          >
            Storage & Packaging
          </button>
        </div>

        <!-- Tab 1: Technical Specs -->
        <div v-if="activeTab === 'spec'" class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-black/5">
              <span class="text-neutral-500">Molecular Formula</span>
              <span class="font-bold text-neutral-900">C14H24N6O4</span>
            </div>
            <div class="flex justify-between py-2 border-b border-black/5">
              <span class="text-neutral-500">Sequence</span>
              <span class="font-bold text-neutral-900">Gly-His-Lys (Copper Complex)</span>
            </div>
            <div class="flex justify-between py-2 border-b border-black/5">
              <span class="text-neutral-500">Physical Appearance</span>
              <span class="font-bold text-neutral-900">Lyophilized Blue Powder</span>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-black/5">
              <span class="text-neutral-500">Purity (HPLC)</span>
              <span class="font-bold text-emerald-600">≥ 99.4%</span>
            </div>
            <div class="flex justify-between py-2 border-b border-black/5">
              <span class="text-neutral-500">Mass Spectrometry (MS)</span>
              <span class="font-bold text-neutral-900">Consistent with theoretical 404.9 Da</span>
            </div>
            <div class="flex justify-between py-2 border-b border-black/5">
              <span class="text-neutral-500">Solubility</span>
              <span class="font-bold text-neutral-900">Sterile Water / Bacteriostatic H2O</span>
            </div>
          </div>
        </div>

        <!-- Tab 2: COA -->
        <div v-if="activeTab === 'coa'" class="space-y-4">
          <div class="p-5 bg-neutral-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p class="text-xs font-bold font-mono text-neutral-900">Independent Analytical Audit Report #8934500101-C</p>
              <p class="text-xs text-neutral-500 mt-0.5">Conducted by Apex Spectral Laboratories under ISO 17025 certification.</p>
            </div>
            <button class="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-mono font-medium hover:bg-black transition-colors">
              Download PDF Report
            </button>
          </div>
        </div>

        <!-- Tab 3: Shipping & Storage -->
        <div v-if="activeTab === 'shipping'" class="space-y-3 text-xs text-neutral-600 leading-relaxed font-light">
          <p>
            <strong>Storage:</strong> Lyophilized vials remain stable at room temperature for up to 90 days. For long-term preservation, store at -20°C in an airtight container protected from light.
          </p>
          <p>
            <strong>Packaging:</strong> Sealed under nitrogen in borosilicate type-I glass vials with medical crimp closures.
          </p>
        </div>
      </section>

      <!-- Related Products Grid -->
      <section class="space-y-6">
        <h3 class="font-serif text-2xl font-medium text-neutral-900">Frequently paired materials</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            v-for="rel in relatedProducts"
            :key="rel.id"
            class="bg-white border border-black/5 rounded-3xl p-4 space-y-3 group hover:shadow-lg transition-all"
          >
            <div class="aspect-square rounded-2xl bg-[var(--color-surface)] flex items-center justify-center p-6">
              <img :src="rel.imageUrl" :alt="rel.name" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-medium text-xs text-neutral-900 line-clamp-1">{{ rel.name }}</h4>
                <p class="text-[11px] text-neutral-500 font-mono">{{ rel.spec }}</p>
              </div>
              <span class="font-mono font-bold text-xs text-neutral-900">${{ rel.price.toFixed(2) }}</span>
            </div>
            <button
              @click="addRelated(rel)"
              class="w-full py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-[var(--color-primary)] transition-colors"
            >
              Add to Order
            </button>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const cartStore = useCartStore();

const quantity = ref(1);
const activeTab = ref('spec');

const product = {
  id: 'PEP-GHKCU-50',
  name: 'GHk-Cu 50mg Research Vial',
  category: 'Precision Peptides',
  sku: 'PEP-GHKCU-50',
  barcode: '8934500101',
  spec: '50mg Lyophilized',
  price: 65.00,
  oldPrice: 85.00,
  stock: 120,
  description:
    'GHk-Cu is a naturally occurring human tripeptide with high affinity for copper(II) ions. Clinically recognized for stimulating collagen synthesis, tissue remodeling, and cellular renewal. Lyophilized under vacuum in ISO class-5 cleanrooms.',
  specOptions: ['50mg Standard Vial', '100mg Dual Pack', '250mg Research Batch'],
  images: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800',
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800',
  ],
};

const activeImage = ref(product.images[0]);
const selectedSpec = ref(product.specOptions[0]);

const relatedProducts = [
  {
    id: 'PEP-NAD-500',
    name: 'NAD+ 500mg Cellular Vial',
    sku: 'PEP-NAD-500',
    spec: '500mg Pure Grade',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500',
  },
  {
    id: 'PEP-BPC157-10',
    name: 'BPC-157 Regenerative Formula',
    sku: 'PEP-BPC157-10',
    spec: '10mg Bio-Active',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500',
  },
  {
    id: 'ACC-BAG-01',
    name: 'Small Travel Leather Barrel Bag',
    sku: 'ACC-BAG-01',
    spec: 'Cognac Saddle Leather',
    price: 185.00,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
  },
];

const addToCart = () => {
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem({
      id: product.id,
      name: `${product.name} (${selectedSpec.value})`,
      sku: product.sku,
      price: product.price,
      imageUrl: activeImage.value,
      spec: selectedSpec.value,
    });
  }
};

const addRelated = (item: any) => {
  cartStore.addItem({
    id: item.id,
    name: item.name,
    sku: item.sku,
    price: item.price,
    imageUrl: item.imageUrl,
    spec: item.spec,
  });
};
</script>
