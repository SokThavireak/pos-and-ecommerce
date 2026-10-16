<template>
  <div class="lg:col-span-8 bg-white border border-black/5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
    <div class="flex items-center justify-between pb-4 border-b border-black/5">
      <div>
        <h3 class="text-sm font-bold text-neutral-900 uppercase tracking-wider font-mono">Top Products by Units Sold</h3>
        <p class="text-xs text-neutral-400">POS and e-commerce multichannel performance.</p>
      </div>
      <button class="text-xs text-neutral-500 hover:text-black font-mono">View All Products →</button>
    </div>

    <!-- Product Table -->
    <div class="overflow-x-auto my-3">
      <table class="w-full text-left text-xs font-mono">
        <thead class="text-neutral-400 uppercase text-[10px] tracking-wider border-b border-black/5">
          <tr>
            <th class="pb-3 font-medium">Product</th>
            <th class="pb-3 font-medium">Category</th>
            <th class="pb-3 font-medium">Unit Price</th>
            <th class="pb-3 font-medium">Units Sold</th>
            <th class="pb-3 font-medium text-right">Channel Volume</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-black/5">
          <tr v-for="item in products" :key="item.name" class="hover:bg-neutral-50/60 transition-colors">
            <td class="py-3 font-sans font-semibold text-neutral-900 flex items-center gap-3">
              <img :src="item.image" :alt="item.name" class="w-8 h-8 rounded-lg object-contain bg-[var(--color-surface)] p-1" />
              <span>{{ item.name }}</span>
            </td>
            <td class="py-3 text-neutral-500">{{ item.category }}</td>
            <td class="py-3 font-bold">${{ item.price.toFixed(2) }}</td>
            <td class="py-3 font-bold text-emerald-600">{{ item.units }} units</td>
            <td class="py-3 text-right text-neutral-600">{{ item.channel }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  products: Array<{
    name: string;
    category: string;
    price: number;
    units: number;
    channel: string;
    image: string;
  }>;
}>();
</script>
