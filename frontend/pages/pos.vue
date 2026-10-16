<template>
  <div class="h-screen bg-[#f4f5f7] p-3 sm:p-5 flex gap-4 antialiased overflow-hidden">
    <!-- Floating Vertical Dark Pill Sidebar -->
    <AdminSidebar />

    <!-- POS Main Container: Catalog Grid (8 cols) & Receipt Ticket + Checkout (4 cols) -->
    <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 h-full overflow-hidden">
      <!-- Left Column: Catalog & Barcode Scanner -->
      <PosCatalogGrid
        :products="displayedProducts"
        :all-products-count="products.length"
        :has-more="hasMore"
        :is-loading-more="isLoadingMore"
        :is-loading="isInitialLoading"
        :categories="categories"
        @add-to-cart="addToCart"
        @barcode-scan="handleBarcodeScan"
        @load-more="loadMore"
      />

      <!-- Right Column: Active Receipt Ticket & Totals -->
      <PosReceiptTicket
        :items="cartStore.items"
        :order-counter="orderCounter"
        @clear-cart="cartStore.clearCart"
        @increase-item="cartStore.addItem"
        @decrease-item="cartStore.decreaseItem"
        @open-checkout="isCheckoutOpen = true"
      />
    </main>

    <!-- Modal: Checkout Terminal -->
    <PosCheckoutModal
      :show="isCheckoutOpen"
      :order-counter="orderCounter"
      :total="cartStore.totalAmount * 1.08"
      :is-processing="isProcessingCheckout"
      @close="isCheckoutOpen = false"
      @confirm="completeSale"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useAlertStore } from '~/stores/alert';
import AdminSidebar from '~/components/AdminSidebar.vue';
import PosCatalogGrid from '~/components/pos/PosCatalogGrid.vue';
import PosReceiptTicket from '~/components/pos/PosReceiptTicket.vue';
import PosCheckoutModal from '~/components/pos/PosCheckoutModal.vue';

const cartStore = useCartStore();
const alertStore = useAlertStore();
const orderCounter = ref(1048);
const isCheckoutOpen = ref(false);
const isProcessingCheckout = ref(false);

const isInitialLoading = ref(true);
const pageLimit = ref(6);
const isLoadingMore = ref(false);

const categories = ref([
  { name: 'Precision Peptides', slug: 'peptides' },
  { name: 'Editorial Apparel', slug: 'apparel' },
  { name: 'Accessories', slug: 'accessories' },
]);

const products = ref([
  {
    id: 'p-1',
    name: 'Epithalon 20mg Peptide Vial',
    sku: 'PEP-EPI-20',
    barcode: '8934500109',
    price: 75.00,
    stock: 120,
    categorySlug: 'peptides',
    spec: '20mg Lyophilized',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-2',
    name: 'BPC-157 5mg Vial',
    sku: 'PEP-BPC-05',
    barcode: '8934500101',
    price: 48.00,
    stock: 85,
    categorySlug: 'peptides',
    spec: '5mg Lyophilized',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-3',
    name: 'GHK-Cu 50mg Tripeptide',
    sku: 'PEP-GHK-50',
    barcode: '8934500103',
    price: 62.00,
    stock: 24,
    categorySlug: 'peptides',
    spec: '50mg Pure Copper',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-4',
    name: 'TB-500 10mg Vial',
    sku: 'PEP-TB5-10',
    barcode: '8934500102',
    price: 58.00,
    stock: 40,
    categorySlug: 'peptides',
    spec: '10mg Thymosin Beta-4',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-5',
    name: 'Structured Lab Oversized Tee',
    sku: 'APP-TEE-01',
    barcode: '8934500104',
    price: 95.00,
    stock: 110,
    categorySlug: 'apparel',
    spec: '320 GSM French Terry',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-6',
    name: 'Minimalist Research Lab Coat',
    sku: 'APP-COAT-01',
    barcode: '8934500105',
    price: 210.00,
    stock: 35,
    categorySlug: 'apparel',
    spec: 'Bonded Poplin Wool',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-7',
    name: 'Semax 30mg Nootropic Peptide',
    sku: 'PEP-SMX-30',
    barcode: '8934500106',
    price: 82.00,
    stock: 65,
    categorySlug: 'peptides',
    spec: '30mg Lyophilized',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-8',
    name: 'Selank 10mg Anxiolytic Peptide',
    sku: 'PEP-SLK-10',
    barcode: '8934500107',
    price: 52.00,
    stock: 48,
    categorySlug: 'peptides',
    spec: '10mg Lyophilized',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p-9',
    name: 'Precision Micro-Syringes (100pk)',
    sku: 'ACC-SYR-100',
    barcode: '8934500108',
    price: 38.00,
    stock: 150,
    categorySlug: 'accessories',
    spec: '0.5ml 31G 5/16"',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
  },
]);

const displayedProducts = computed(() => {
  return products.value.slice(0, pageLimit.value);
});

const hasMore = computed(() => {
  return pageLimit.value < products.value.length;
});

async function loadMore() {
  if (isLoadingMore.value || !hasMore.value) return;
  isLoadingMore.value = true;
  await new Promise((r) => setTimeout(r, 400));
  pageLimit.value += 4;
  isLoadingMore.value = false;
}

onMounted(() => {
  setTimeout(() => {
    isInitialLoading.value = false;
  }, 350);
});

function addToCart(product: any) {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: 1,
  });
}

function handleBarcodeScan(code: string) {
  const match = products.value.find((p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
  if (match) {
    addToCart(match);
  } else {
    alertStore.error(`No catalog item identified with barcode: ${code}`, 'Barcode Scan Error');
  }
}

async function completeSale(payload: { method: string; tendered: number }) {
  isProcessingCheckout.value = true;
  await new Promise((r) => setTimeout(r, 600));

  for (const item of cartStore.items) {
    const prod = products.value.find((p) => p.id === item.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  alertStore.success(`Sale completed successfully! Receipt printed for order #POS-${orderCounter.value} (${payload.method})`, 'Sale Processed');
  orderCounter.value++;
  cartStore.clearCart();
  isProcessingCheckout.value = false;
  isCheckoutOpen.value = false;
}
</script>
