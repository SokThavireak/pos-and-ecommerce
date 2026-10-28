<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Full-Height Floating Dark Sidebar -->
    <AdminSidebar />

    <!-- Main Workspace Container -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-6">
      <!-- Top Bar: Title + Controls -->
      <header class="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Product Catalog Management</h1>
            <span class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              OWNER PRIVILEGES
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            View, edit prices, update specifications, and adjust inventory for all catalog items.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search items, SKU, barcode..."
            class="bg-neutral-100 text-xs px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-black w-60"
          />
          <NuxtLink
            to="/admin/categories"
            class="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            Manage Categories
          </NuxtLink>
          <button
            @click="openAddModal"
            class="px-5 py-2.5 bg-neutral-950 text-white rounded-full text-xs font-semibold hover:bg-[var(--color-primary)] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Add New Product</span>
          </button>
        </div>
      </header>

      <!-- Products Grid & Table View -->
      <div class="flex-1 bg-white border border-black/5 rounded-3xl p-6 shadow-xs flex flex-col overflow-hidden space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-black/5">
          <div class="flex items-center gap-2">
            <button
              v-for="cat in ['All', 'Precision Peptides', 'Editorial Apparel', 'Accessories']"
              :key="cat"
              @click="selectedCategory = cat"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
              :class="selectedCategory === cat ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
            >
              {{ cat }}
            </button>
          </div>
          <span class="text-xs font-mono text-neutral-400">Showing {{ filteredProducts.length }} items</span>
        </div>

        <!-- Scrollable Products Table -->
        <div class="flex-1 overflow-y-auto pr-1">
          <table class="w-full text-left text-xs">
            <thead class="text-neutral-400 uppercase tracking-wider font-mono border-b border-black/5 sticky top-0 bg-white z-10">
              <tr>
                <th class="pb-3 font-medium">Product / Image</th>
                <th class="pb-3 font-medium">Category</th>
                <th class="pb-3 font-medium">SKU & Barcode</th>
                <th class="pb-3 font-medium">Current Price</th>
                <th class="pb-3 font-medium">Old Price</th>
                <th class="pb-3 font-medium">Live Stock</th>
                <th class="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5">
              <tr v-for="item in filteredProducts" :key="item.sku" class="hover:bg-neutral-50/80 transition-colors">
                <td class="py-3 flex items-center gap-3">
                  <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 rounded-xl object-contain bg-[var(--color-surface)] p-1.5" />
                  <div>
                    <p class="font-semibold text-neutral-900">{{ item.name }}</p>
                    <p class="text-[11px] text-neutral-400 font-mono">{{ item.spec }}</p>
                  </div>
                </td>
                <td class="py-3 text-neutral-600 font-medium">{{ item.category }}</td>
                <td class="py-3 font-mono">
                  <p class="text-neutral-900 font-semibold">{{ item.sku }}</p>
                  <p class="text-[10px] text-neutral-400">{{ item.barcode }}</p>
                </td>
                <td class="py-3 font-mono font-bold text-neutral-900">${{ item.price.toFixed(2) }}</td>
                <td class="py-3 font-mono text-neutral-400 line-through">
                  {{ item.oldPrice ? `$${item.oldPrice.toFixed(2)}` : '—' }}
                </td>
                <td class="py-3 font-mono font-bold" :class="item.stock < 50 ? 'text-amber-600' : 'text-neutral-800'">
                  {{ item.stock }} units
                </td>
                <td class="py-3 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button
                      @click="editItem(item)"
                      class="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Edit</span>
                    </button>
                    <NuxtLink
                      to="/detail"
                      class="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium transition-colors"
                      title="View Customer Page"
                    >
                      View
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Edit Product Modal (Owner Authority) -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-black/5">
          <div>
            <h3 class="text-base font-bold text-neutral-900">Edit Product Information</h3>
            <p class="text-xs text-neutral-500 font-mono">{{ activeEditItem.sku }}</p>
          </div>
          <button @click="showEditModal = false" class="text-neutral-400 hover:text-black font-mono">✕</button>
        </div>

        <form @submit.prevent="saveItemEdits" class="space-y-3.5 text-xs">
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Product Title</label>
            <input
              type="text"
              v-model="activeEditItem.name"
              required
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-neutral-700 font-medium mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                v-model.number="activeEditItem.price"
                required
                class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label class="block text-neutral-700 font-medium mb-1">Old Price ($) [Optional]</label>
              <input
                type="number"
                step="0.01"
                v-model.number="activeEditItem.oldPrice"
                class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-neutral-700 font-medium mb-1">Stock Quantity</label>
              <input
                type="number"
                v-model.number="activeEditItem.stock"
                required
                class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label class="block text-neutral-700 font-medium mb-1">Barcode</label>
              <input
                type="text"
                v-model="activeEditItem.barcode"
                class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label class="block text-neutral-700 font-medium mb-1">Specification / Formulation</label>
            <input
              type="text"
              v-model="activeEditItem.spec"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label class="block text-neutral-700 font-medium mb-1">Image URL</label>
            <input
              type="text"
              v-model="activeEditItem.imageUrl"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>

          <div class="flex items-center gap-3 pt-3">
            <button
              type="button"
              @click="showEditModal = false"
              class="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:border-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-[var(--color-primary)] transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuditStore } from '~/stores/audit';
import { useAlertStore } from '~/stores/alert';
import { useAuthStore } from '~/stores/auth';

const auditStore = useAuditStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const selectedCategory = ref('All');
const showEditModal = ref(false);

const activeEditItem = ref<any>({});

const products = ref([
  {
    name: 'GHk-Cu 50mg Research Vial',
    sku: 'PEP-GHKCU-50',
    barcode: '8934500101',
    category: 'Precision Peptides',
    spec: '50mg Lyophilized',
    price: 65.0,
    oldPrice: 85.0,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
  },
  {
    name: 'NAD+ 500mg Cellular Vial',
    sku: 'PEP-NAD-500',
    barcode: '8934500102',
    category: 'Precision Peptides',
    spec: '500mg Pure Grade',
    price: 95.0,
    oldPrice: 120.0,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500',
  },
  {
    name: 'BPC-157 Regenerative Formula',
    sku: 'PEP-BPC157-10',
    barcode: '8934500103',
    category: 'Precision Peptides',
    spec: '10mg Bio-Active',
    price: 52.0,
    oldPrice: 65.0,
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500',
  },
  {
    name: 'Sleeved Cardigan in Charcoal',
    sku: 'APP-CARD-01',
    barcode: '8934500201',
    category: 'Editorial Apparel',
    spec: 'Size M / L',
    price: 52.25,
    oldPrice: 55.0,
    stock: 118,
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
  },
  {
    name: 'Relaxed Fit Linen Shorts',
    sku: 'APP-SHRT-02',
    barcode: '8934500202',
    category: 'Editorial Apparel',
    spec: 'Off-White / 32',
    price: 49.5,
    oldPrice: 60.0,
    stock: 328,
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
  },
  {
    name: 'Custom T-Shirt for Men',
    sku: 'APP-TSHRT-03',
    barcode: '8934500203',
    category: 'Editorial Apparel',
    spec: 'Heavyweight Cotton',
    price: 28.0,
    oldPrice: 35.0,
    stock: 210,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
  },
  {
    name: 'Small Travel Leather Barrel Bag',
    sku: 'ACC-BAG-01',
    barcode: '8934500301',
    category: 'Accessories',
    spec: 'Cognac Saddle Leather',
    price: 185.0,
    oldPrice: 220.0,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
  },
  {
    name: 'Wood Finish Sunglasses',
    sku: 'ACC-SUN-02',
    barcode: '8934500302',
    category: 'Accessories',
    spec: 'Polarized UV400',
    price: 68.0,
    oldPrice: 85.0,
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
  },
]);

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesCat = selectedCategory.value === 'All' || p.category === selectedCategory.value;
    const matchesSearch =
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.barcode.includes(searchQuery.value);
    return matchesCat && matchesSearch;
  });
});

const editItem = (item: any) => {
  activeEditItem.value = { ...item };
  showEditModal.value = true;
};

const openAddModal = () => {
  activeEditItem.value = {
    name: '',
    sku: `PEP-NEW-${Date.now().toString().slice(-4)}`,
    barcode: '8934500' + Math.floor(100 + Math.random() * 900),
    category: 'Precision Peptides',
    spec: 'Lyophilized Research Grade',
    price: 50.0,
    oldPrice: 65.0,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500',
  };
  showEditModal.value = true;
};

const saveItemEdits = () => {
  const index = products.value.findIndex((p) => p.sku === activeEditItem.value.sku);
  if (index !== -1) {
    const oldPrice = products.value[index].price;
    const newPrice = activeEditItem.value.price;
    products.value[index] = { ...activeEditItem.value };

    auditStore.recordActivity({
      actorName: authStore.user?.fullName || 'Store Owner',
      role: 'OWNER',
      category: 'PRICE_UPDATE',
      actionDescription: `Updated product "${activeEditItem.value.name}" (SKU: ${activeEditItem.value.sku}) pricing: $${oldPrice.toFixed(2)} -> $${newPrice.toFixed(2)}, stock: ${activeEditItem.value.stock}`,
      meta: `Catalog Ingest • Barcode: ${activeEditItem.value.barcode || 'N/A'}`,
    });
    alertStore.success(`Updated item ${activeEditItem.value.name} successfully.`, 'Item Saved');
  } else {
    products.value.unshift({ ...activeEditItem.value });
    auditStore.recordActivity({
      actorName: authStore.user?.fullName || 'Store Owner',
      role: 'OWNER',
      category: 'STOCK_RESTOCK',
      actionDescription: `Created new catalog product "${activeEditItem.value.name}" (SKU: ${activeEditItem.value.sku}) with ${activeEditItem.value.stock} units initial stock`,
      meta: `Unit Price: $${activeEditItem.value.price.toFixed(2)}`,
    });
    alertStore.success(`Added new product ${activeEditItem.value.name} to catalog.`, 'Product Created');
  }
  showEditModal.value = false;
};
</script>
