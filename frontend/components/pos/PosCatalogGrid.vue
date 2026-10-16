<template>
  <section class="lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
    <!-- Top Action Bar -->
    <div class="bg-white rounded-3xl p-4 border border-black/5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      <!-- Search & Barcode scanner -->
      <div class="flex items-center gap-2 flex-1 min-w-[240px]">
        <div class="relative flex-1">
          <input
            type="text"
            v-model="search"
            placeholder="Scan Barcode or Search (e.g. 8934500101)..."
            @keyup.enter="handleScan"
            class="w-full bg-neutral-100 text-xs px-4 py-2.5 rounded-full pl-9 focus:outline-none focus:ring-1 focus:ring-black font-mono"
          />
          <svg class="w-4 h-4 text-neutral-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          @click="handleScan"
          class="px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-medium hover:bg-black transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Scan
        </button>
      </div>

      <!-- Cashier Terminal Badge -->
      <div class="flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-full text-xs font-mono text-neutral-700">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Terminal #01 (Active)</span>
      </div>
    </div>

    <!-- Category Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
      <button
        @click="selectedCategory = null"
        class="px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0"
        :class="!selectedCategory ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'"
      >
        All Products
      </button>
      <button
        v-for="cat in categories"
        :key="cat.slug"
        @click="selectedCategory = cat.slug"
        class="px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0"
        :class="selectedCategory === cat.slug ? 'bg-neutral-900 text-white shadow-sm' : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Product Display Section -->
    <div class="flex-1 overflow-y-auto pr-1">
      <!-- Skeleton Loading State -->
      <SkeletonLoader v-if="isLoading" type="pos-grid" :count="8" />

      <!-- Loaded Product Cards Grid -->
      <template v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            @click="$emit('add-to-cart', product)"
            class="bg-white border border-black/5 rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:border-[var(--color-primary)] hover:shadow-md transition-all group select-none active:scale-[0.98]"
          >
            <div class="aspect-square bg-[var(--color-surface)] rounded-xl overflow-hidden flex items-center justify-center p-3 relative">
              <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
              <span class="absolute top-2 right-2 text-[10px] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full font-mono text-neutral-600 font-semibold">
                {{ product.stock }} left
              </span>
            </div>

            <div class="pt-3 space-y-1">
              <p class="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                {{ product.name }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-neutral-900">${{ product.price.toFixed(2) }}</span>
                <span class="text-[10px] text-neutral-400 font-mono">{{ product.spec }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll / Load More Footer -->
        <div v-if="hasMore" class="py-4 flex justify-center">
          <button
            @click="$emit('load-more')"
            :disabled="isLoadingMore"
            class="px-5 py-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <svg v-if="isLoadingMore" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-else>Load More Items ({{ products.length }}/{{ allProductsCount }}) ↓</span>
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SkeletonLoader from '~/components/ui/SkeletonLoader.vue';

const props = withDefaults(
  defineProps<{
    products: Array<any>;
    allProductsCount?: number;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    isLoading?: boolean;
    categories: Array<{ name: string; slug: string }>;
  }>(),
  {
    allProductsCount: 0,
    hasMore: false,
    isLoadingMore: false,
    isLoading: false,
  }
);

const emit = defineEmits<{
  (e: 'add-to-cart', product: any): void;
  (e: 'barcode-scan', barcode: string): void;
  (e: 'load-more'): void;
}>();

const search = ref('');
const selectedCategory = ref<string | null>(null);

const filteredProducts = computed(() => {
  return props.products.filter((p) => {
    const matchCat = !selectedCategory.value || p.categorySlug === selectedCategory.value;
    const matchSearch =
      !search.value ||
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.barcode?.includes(search.value) ||
      p.sku?.toLowerCase().includes(search.value.toLowerCase());
    return matchCat && matchSearch;
  });
});

function handleScan() {
  if (search.value.trim()) {
    emit('barcode-scan', search.value.trim());
    search.value = '';
  }
}
</script>
