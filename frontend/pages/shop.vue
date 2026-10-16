<template>
  <div class="flex-1 flex flex-col">
    <SiteHeader />

    <!-- Minimalist Subheader Banner -->
    <section class="w-full bg-[#f4f5f7] border-b border-black/5 py-10">
      <div class="max-w-7xl mx-auto px-6 text-center space-y-2">
        <h1 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900">Shop Catalog</h1>
        <div class="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
          <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">Shop</span>
        </div>
      </div>
    </section>

    <!-- Main Container: 2-column Asymmetric Layout -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Filter Sidebar (3 cols) -->
        <ShopSidebarFilter
          :categories="categories"
          :selected-category="selectedCategory"
          :max-price="maxPrice"
          :selected-sizes="selectedSizes"
          :mini-featured="miniFeatured"
          @select-category="selectedCategory = $event"
          @update:max-price="maxPrice = $event"
          @toggle-size="toggleSize"
          @add-to-cart="addToCart"
        />

        <!-- Main Catalog (9 cols) -->
        <section class="lg:col-span-9 space-y-6">
          <ShopPromoBanner />

          <!-- Toolbar (Count + Sort) -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
            <p class="text-xs text-neutral-500 font-mono">
              Showing <span class="font-bold text-neutral-900">{{ displayedProducts.length }}</span> of {{ filteredProducts.length }} items
            </p>
            <div class="flex items-center gap-3">
              <span class="text-xs text-neutral-500">Sort By:</span>
              <select
                v-model="sortBy"
                class="bg-neutral-100 text-xs px-3 py-1.5 rounded-full text-neutral-800 border-none focus:ring-1 focus:ring-black cursor-pointer font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <!-- Initial Skeleton Loading State -->
          <SkeletonLoader v-if="isInitialLoading" type="card-grid" :count="6" />

          <!-- Catalog Grid -->
          <template v-else>
            <ShopCatalogGrid
              :products="displayedProducts"
              @add-to-cart="addToCart"
            />

            <!-- Infinite Scroll / Load More Trigger Sentinel -->
            <div class="pt-8 pb-4 flex flex-col items-center justify-center space-y-3">
              <div v-if="hasMore" class="flex flex-col items-center gap-3">
                <button
                  @click="loadMore"
                  :disabled="isLoadingMore"
                  class="px-8 py-3.5 bg-neutral-950 text-white hover:bg-[var(--color-primary)] rounded-full text-xs font-semibold shadow-sm transition-all flex items-center gap-2 group"
                >
                  <svg v-if="isLoadingMore" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span v-else>Load More Items (Showing {{ displayedProducts.length }}/{{ filteredProducts.length }})</span>
                  <span class="group-hover:translate-y-0.5 transition-transform">↓</span>
                </button>
                <p class="text-[11px] text-neutral-400 font-mono">Scroll down or click to stream more catalog products</p>
              </div>
              <div v-else class="text-xs text-neutral-400 font-mono">
                ✓ All {{ filteredProducts.length }} products loaded into view
              </div>
            </div>
          </template>
        </section>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';
import ShopSidebarFilter from '~/components/shop/ShopSidebarFilter.vue';
import ShopPromoBanner from '~/components/shop/ShopPromoBanner.vue';
import ShopCatalogGrid from '~/components/shop/ShopCatalogGrid.vue';
import SkeletonLoader from '~/components/ui/SkeletonLoader.vue';

const cartStore = useCartStore();

const isInitialLoading = ref(true);
const selectedCategory = ref<string | null>(null);
const maxPrice = ref(220);
const selectedSizes = ref<string[]>([]);
const sortBy = ref('featured');

// Pagination / Scroll Down Limit
const pageLimit = ref(6);
const isLoadingMore = ref(false);

const categories = ref([
  { name: 'Precision Peptides', slug: 'peptides', count: 6 },
  { name: 'Editorial Apparel', slug: 'apparel', count: 4 },
  { name: 'Glassware & Syringes', slug: 'accessories', count: 3 },
]);

// Extended rich catalog list for scroll-down demonstration
const products = ref([
  {
    id: 'p-1',
    name: 'Epithalon 20mg Peptide Vial',
    sku: 'PEP-EPI-20',
    category: 'Precision Peptides',
    categorySlug: 'peptides',
    price: 75.00,
    oldPrice: 95.00,
    stock: 120,
    spec: '20mg Lyophilized',
    tag: 'Pure Grade',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-2',
    name: 'BPC-157 5mg Vial',
    sku: 'PEP-BPC-05',
    category: 'Precision Peptides',
    categorySlug: 'peptides',
    price: 48.00,
    stock: 85,
    spec: '5mg Lyophilized',
    tag: 'Bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-3',
    name: 'GHK-Cu 50mg Tripeptide',
    sku: 'PEP-GHK-50',
    category: 'Precision Peptides',
    categorySlug: 'peptides',
    price: 62.00,
    oldPrice: 78.00,
    stock: 24,
    spec: '50mg Pure Copper',
    tag: 'Sale',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-4',
    name: 'TB-500 10mg Vial',
    sku: 'PEP-TB5-10',
    category: 'Precision Peptides',
    categorySlug: 'peptides',
    price: 58.00,
    stock: 40,
    spec: '10mg Thymosin Beta-4',
    tag: 'Lab Certified',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-5',
    name: 'Structured Lab Oversized Tee',
    sku: 'APP-TEE-01',
    category: 'Editorial Apparel',
    categorySlug: 'apparel',
    price: 95.00,
    stock: 110,
    spec: '320 GSM French Terry',
    tag: 'New Release',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-6',
    name: 'Minimalist Research Lab Coat',
    sku: 'APP-COAT-01',
    category: 'Editorial Apparel',
    categorySlug: 'apparel',
    price: 210.00,
    stock: 35,
    spec: 'Bonded Poplin Wool',
    tag: 'Limited Edition',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-7',
    name: 'Semax 30mg Nootropic Peptide',
    sku: 'PEP-SMX-30',
    category: 'Precision Peptides',
    categorySlug: 'peptides',
    price: 82.00,
    stock: 65,
    spec: '30mg Lyophilized',
    tag: 'Cognitive',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-8',
    name: 'Selank 10mg Anxiolytic Peptide',
    sku: 'PEP-SLK-10',
    category: 'Precision Peptides',
    categorySlug: 'peptides',
    price: 52.00,
    stock: 48,
    spec: '10mg Lyophilized',
    tag: 'Certified Lot',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-9',
    name: 'Heavyweight Research Hoodie',
    sku: 'APP-HOD-01',
    category: 'Editorial Apparel',
    categorySlug: 'apparel',
    price: 135.00,
    stock: 80,
    spec: '450 GSM Heavy Fleece',
    tag: 'Archive',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-10',
    name: 'Precision Micro-Syringes (100pk)',
    sku: 'ACC-SYR-100',
    category: 'Glassware & Syringes',
    categorySlug: 'accessories',
    price: 38.00,
    stock: 150,
    spec: '0.5ml 31G 5/16"',
    tag: 'Sterile',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-11',
    name: 'Bacteriostatic Water 30ml',
    sku: 'ACC-BAC-30',
    category: 'Glassware & Syringes',
    categorySlug: 'accessories',
    price: 18.00,
    stock: 300,
    spec: 'USP Grade 0.9% Benzyl Alcohol',
    tag: 'Stocked',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-12',
    name: 'Borosilicate Amber Reconstitution Vials',
    sku: 'ACC-VIL-10',
    category: 'Glassware & Syringes',
    categorySlug: 'accessories',
    price: 24.00,
    stock: 90,
    spec: 'Pack of 10x 10ml Vials',
    tag: 'Autoclavable',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
]);

const miniFeatured = computed(() => products.value.slice(0, 3));

const filteredProducts = computed(() => {
  let list = products.value.filter((p) => {
    const matchCat = !selectedCategory.value || p.categorySlug === selectedCategory.value;
    const matchPrice = p.price <= maxPrice.value;
    return matchCat && matchPrice;
  });

  if (sortBy.value === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }
  return list;
});

// Display limited items for scroll-down show more
const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, pageLimit.value);
});

const hasMore = computed(() => {
  return pageLimit.value < filteredProducts.value.length;
});

async function loadMore() {
  if (isLoadingMore.value || !hasMore.value) return;
  isLoadingMore.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  pageLimit.value += 6;
  isLoadingMore.value = false;
}

onMounted(() => {
  // Fast initial page paint simulation
  setTimeout(() => {
    isInitialLoading.value = false;
  }, 400);

  // Auto scroll down detection for show more data
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 300;
      if (scrollPosition >= threshold && hasMore.value && !isLoadingMore.value) {
        loadMore();
      }
    });
  }
});

function toggleSize(size: string) {
  if (selectedSizes.value.includes(size)) {
    selectedSizes.value = selectedSizes.value.filter((s) => s !== size);
  } else {
    selectedSizes.value.push(size);
  }
}

function addToCart(p: any) {
  cartStore.addItem({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    quantity: 1,
  });
}
</script>
