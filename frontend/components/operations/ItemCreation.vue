<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <div class="lg:col-span-5 bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
      <div>
        <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">CATALOG INGEST</span>
        <h2 class="text-lg font-bold text-neutral-900">Add New Product</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Create inventory items with SKU, barcode, and spec tags.</p>
      </div>

      <form @submit.prevent="handleCreate" class="space-y-3 text-xs">
        <div>
          <label class="block text-neutral-700 font-medium mb-1">Product Title</label>
          <input
            type="text"
            v-model="newItem.name"
            required
            placeholder="e.g. Epithalon 20mg Peptide Vial"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-neutral-700 font-medium mb-1">SKU</label>
            <input
              type="text"
              v-model="newItem.sku"
              required
              placeholder="PEP-EPI-20"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Barcode</label>
            <input
              type="text"
              v-model="newItem.barcode"
              placeholder="8934500109"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              v-model.number="newItem.price"
              required
              placeholder="75.00"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Initial Stock</label>
            <input
              type="number"
              v-model.number="newItem.stock"
              required
              placeholder="100"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Category</label>
          <select
            v-model="newItem.category"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black font-medium"
          >
            <option value="Precision Peptides">Precision Peptides</option>
            <option value="Editorial Apparel">Editorial Apparel</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Specification / Dosage</label>
          <input
            type="text"
            v-model="newItem.spec"
            placeholder="20mg Lyophilized powder"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Image URL</label>
          <input
            type="text"
            v-model="newItem.imageUrl"
            placeholder="https://images.unsplash.com/..."
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-neutral-950 text-white rounded-xl font-semibold text-xs hover:bg-[var(--color-primary)] transition-colors shadow-sm mt-2"
        >
          Save & Broadcast to POS
        </button>
      </form>
    </div>

    <!-- Product Preview Feed (7 cols) -->
    <div class="lg:col-span-7 bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-neutral-900">Current Catalog Feed</h3>
          <p class="text-xs text-neutral-500">{{ items.length }} active products</p>
        </div>
      </div>

      <div class="divide-y divide-black/5 max-h-[560px] overflow-y-auto pr-1">
        <div
          v-for="item in items"
          :key="item.sku"
          class="py-3 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 rounded-xl object-contain bg-[var(--color-surface)] p-1.5" />
            <div>
              <p class="text-xs font-semibold text-neutral-900">{{ item.name }}</p>
              <p class="text-[11px] text-neutral-400 font-mono">SKU: {{ item.sku }} • {{ item.category }}</p>
            </div>
          </div>

          <div class="text-right flex items-center gap-3">
            <div>
              <p class="text-xs font-bold font-mono text-neutral-900">${{ item.price.toFixed(2) }}</p>
              <span class="text-[10px] font-mono font-semibold" :class="item.stock < 50 ? 'text-amber-600' : 'text-neutral-500'">
                {{ item.stock }} in stock
              </span>
            </div>
            <button
              @click="$emit('edit-item', item)"
              class="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps<{
  items: Array<{
    name: string;
    sku: string;
    barcode: string;
    price: number;
    stock: number;
    category: string;
    spec: string;
    imageUrl: string;
  }>;
}>();

const emit = defineEmits<{
  (e: 'create-item', payload: any): void;
  (e: 'edit-item', item: any): void;
}>();

const newItem = reactive({
  name: '',
  sku: '',
  barcode: '',
  price: 65,
  stock: 50,
  category: 'Precision Peptides',
  spec: '10mg Bio-active vial',
  imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
});

function handleCreate() {
  emit('create-item', { ...newItem });
  newItem.name = '';
  newItem.sku = '';
  newItem.barcode = '';
}
</script>
