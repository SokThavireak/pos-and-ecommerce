<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">IMMUTABLE LOG</span>
        <h2 class="text-xl font-bold text-neutral-900">Stock Movement & Restock Ledger</h2>
        <p class="text-xs text-neutral-500">Every inventory adjustment, checkout deduction, and lot intake recorded in real-time.</p>
      </div>
      <button class="px-4 py-2 border border-neutral-300 rounded-full text-xs font-mono font-medium hover:border-black transition-colors">
        Export CSV Ledger
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="text-neutral-400 uppercase tracking-wider font-mono border-b border-black/5">
          <tr>
            <th class="pb-3 font-medium">Timestamp</th>
            <th class="pb-3 font-medium">Product / SKU</th>
            <th class="pb-3 font-medium">Event Type</th>
            <th class="pb-3 font-medium">Quantity Delta</th>
            <th class="pb-3 font-medium">Initiated By</th>
            <th class="pb-3 font-medium text-right">Balance After</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-black/5 font-mono">
          <tr v-for="log in logs" :key="log.id" class="hover:bg-neutral-50 transition-colors">
            <td class="py-3 text-neutral-500">{{ log.time }}</td>
            <td class="py-3 font-semibold text-neutral-900">{{ log.productName }} <span class="text-neutral-400">({{ log.sku }})</span></td>
            <td class="py-3">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="{
                  'bg-emerald-100 text-emerald-800': log.type === 'RESTOCK',
                  'bg-blue-100 text-blue-800': log.type === 'POS_SALE',
                  'bg-purple-100 text-purple-800': log.type === 'WEB_ORDER',
                }"
              >
                {{ log.type }}
              </span>
            </td>
            <td class="py-3 font-bold" :class="log.delta > 0 ? 'text-emerald-600' : 'text-rose-600'">
              {{ log.delta > 0 ? `+${log.delta}` : log.delta }}
            </td>
            <td class="py-3 text-neutral-700">{{ log.user }}</td>
            <td class="py-3 text-right font-bold text-neutral-900">{{ log.balanceAfter }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  logs: Array<{
    id: string;
    time: string;
    productName: string;
    sku: string;
    type: string;
    delta: number;
    user: string;
    balanceAfter: number;
  }>;
}>();
</script>
