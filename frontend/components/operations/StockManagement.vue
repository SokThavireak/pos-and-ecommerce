<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">INVENTORY DISPATCH</span>
        <h2 class="text-xl font-bold text-neutral-900">Live Stock Balances & Quick Replenishment</h2>
        <p class="text-xs text-neutral-500">Increase or adjust shelf inventory for POS counters and online orders.</p>
      </div>

      <div class="relative w-full sm:w-64">
        <input
          type="text"
          v-model="stockFilter"
          placeholder="Search item or SKU..."
          class="w-full bg-neutral-100 text-xs px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="text-neutral-400 uppercase tracking-wider font-mono border-b border-black/5">
          <tr>
            <th class="pb-3 font-medium">Item Name & SKU</th>
            <th class="pb-3 font-medium">Category</th>
            <th class="pb-3 font-medium">Unit Price</th>
            <th class="pb-3 font-medium">Current Stock</th>
            <th class="pb-3 font-medium">Status</th>
            <th class="pb-3 font-medium text-right">Quick Restock</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-black/5">
          <tr v-for="item in filteredStockItems" :key="item.sku" class="hover:bg-neutral-50/80 transition-colors">
            <td class="py-3 flex items-center gap-3">
              <img :src="item.imageUrl" :alt="item.name" class="w-9 h-9 rounded-xl object-contain bg-[var(--color-surface)] p-1" />
              <div>
                <p class="font-semibold text-neutral-900">{{ item.name }}</p>
                <p class="text-[10px] text-neutral-400 font-mono">{{ item.sku }}</p>
              </div>
            </td>
            <td class="py-3 text-neutral-600">{{ item.category }}</td>
            <td class="py-3 font-mono font-bold text-neutral-900">${{ item.price.toFixed(2) }}</td>
            <td class="py-3">
              <!-- Editable Live Stock Input -->
              <div class="flex items-center gap-1.5">
                <input
                  type="number"
                  v-model.number="item.stock"
                  @change="$emit('set-stock', item, item.stock)"
                  class="w-20 bg-neutral-100 hover:bg-neutral-200 focus:bg-white border border-neutral-300 focus:border-black rounded-lg px-2 py-1 text-xs font-mono font-bold text-neutral-900 focus:outline-none transition-colors"
                  :class="item.stock < 50 ? 'text-rose-600' : 'text-neutral-900'"
                />
                <span class="text-[10px] text-neutral-400 font-mono">units</span>
              </div>
            </td>
            <td class="py-3">
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold"
                :class="item.stock > 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
              >
                {{ item.stock > 60 ? 'Healthy' : 'Low Stock Alert' }}
              </span>
            </td>
            <td class="py-3 text-right">
              <div class="inline-flex items-center gap-1.5">
                <button
                  @click="$emit('adjust-stock', item, 10)"
                  class="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg text-[11px] font-mono transition-colors"
                >
                  +10
                </button>
                <button
                  @click="$emit('adjust-stock', item, 50)"
                  class="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg text-[11px] font-mono transition-colors"
                >
                  +50
                </button>
                <button
                  @click="$emit('adjust-stock', item, 100)"
                  class="px-2.5 py-1 bg-neutral-900 text-white rounded-lg text-[11px] font-mono hover:bg-black transition-colors"
                >
                  +100
                </button>
                <button
                  @click="openCustomAdjust(item)"
                  class="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-300 text-neutral-700 rounded-lg text-[11px] font-mono transition-colors"
                  title="Custom Lot Adjustment"
                >
                  Edit Lot ✎
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Custom Lot Modal -->
    <div
      v-if="showCustomModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-2 border-b border-black/5">
          <div>
            <h3 class="text-sm font-bold text-neutral-900">Custom Stock Intake / Deduction</h3>
            <p class="text-[11px] text-neutral-500 font-mono">{{ activeItem?.sku }}</p>
          </div>
          <button @click="showCustomModal = false" class="text-neutral-400 hover:text-black font-mono">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Product</label>
            <p class="font-semibold text-neutral-900">{{ activeItem?.name }}</p>
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Adjustment Delta (+/- units)</label>
            <input
              type="number"
              v-model.number="customDelta"
              placeholder="+25 or -10"
              class="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">New Balance Will Be:</label>
            <p class="font-mono font-bold text-base text-[var(--color-primary)]">
              {{ Math.max(0, (activeItem?.stock || 0) + customDelta) }} units
            </p>
          </div>
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
            <button
              type="button"
              @click="showCustomModal = false"
              class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="applyCustomDelta"
              class="px-5 py-2 bg-neutral-950 text-white rounded-xl font-semibold hover:bg-[var(--color-primary)] transition-colors"
            >
              Apply Adjustment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  items: Array<{
    name: string;
    sku: string;
    barcode: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  }>;
}>();

const emit = defineEmits<{
  (e: 'adjust-stock', item: any, delta: number): void;
  (e: 'set-stock', item: any, newStock: number): void;
}>();

const stockFilter = ref('');
const showCustomModal = ref(false);
const activeItem = ref<any>(null);
const customDelta = ref(0);

function openCustomAdjust(item: any) {
  activeItem.value = item;
  customDelta.value = 0;
  showCustomModal.value = true;
}

function applyCustomDelta() {
  if (activeItem.value && customDelta.value !== 0) {
    emit('adjust-stock', activeItem.value, customDelta.value);
  }
  showCustomModal.value = false;
}

const filteredStockItems = computed(() => {
  if (!stockFilter.value) return props.items;
  const q = stockFilter.value.toLowerCase();
  return props.items.filter(
    (i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)
  );
});
</script>
