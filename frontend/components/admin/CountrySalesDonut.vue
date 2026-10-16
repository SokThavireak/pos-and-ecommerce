<template>
  <div class="lg:col-span-4 bg-white border border-black/5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
    <div class="flex items-center justify-between pb-4 border-b border-black/5">
      <h3 class="text-sm font-bold text-neutral-900 uppercase tracking-wider font-mono">Sales by Country</h3>
      <span class="text-xs text-neutral-400 font-mono">Top Global Hubs</span>
    </div>

    <!-- Segmented Ring Graphic -->
    <div class="py-6 flex flex-col items-center justify-center relative">
      <div class="relative w-40 h-40 flex items-center justify-center">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#f4f5f7" stroke-width="12" fill="none" />
          <circle cx="50" cy="50" r="40" stroke="var(--color-primary)" stroke-width="12" fill="none" stroke-dasharray="160 251.2" stroke-linecap="round" />
          <circle cx="50" cy="50" r="40" stroke="#141414" stroke-width="12" fill="none" stroke-dasharray="60 251.2" stroke-dashoffset="-165" stroke-linecap="round" />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span class="text-xs font-mono text-neutral-400 uppercase">Top Reach</span>
          <span class="text-xl font-bold font-mono text-neutral-900">65.2%</span>
          <span class="text-[10px] text-neutral-500">United States</span>
        </div>
      </div>
    </div>

    <!-- Country Breakdown Bars -->
    <div class="space-y-3 font-mono text-xs">
      <div v-for="c in countries" :key="c.name" class="space-y-1">
        <div class="flex justify-between items-center text-[11px]">
          <span class="text-neutral-700 font-medium">{{ c.name }}</span>
          <span class="font-bold text-neutral-900">{{ c.percent }}%</span>
        </div>
        <div class="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full" :class="c.colorClass" :style="{ width: `${c.percent}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const countries = [
  { name: 'United States', percent: 65, colorClass: 'bg-[var(--color-primary)]' },
  { name: 'United Kingdom', percent: 22, colorClass: 'bg-neutral-900' },
  { name: 'Germany & EU', percent: 13, colorClass: 'bg-neutral-400' },
];
</script>
