<template>
  <div class="lg:col-span-4 space-y-5 flex flex-col justify-between">
    <!-- 1. Total Customers Card -->
    <div class="bg-[#141414] text-white rounded-3xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs text-neutral-400 uppercase tracking-wider font-mono">Total Customers</span>
        <span class="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
          +14.8%
        </span>
      </div>
      <div>
        <p class="text-3xl font-bold tracking-tight">1,226</p>
        <p class="text-xs text-neutral-400 mt-0.5">682 active clients this month</p>
      </div>
      <!-- Split Progress Bar -->
      <div class="space-y-1.5 pt-1">
        <div class="w-full h-3 bg-neutral-800 rounded-full flex overflow-hidden p-0.5">
          <div class="bg-[var(--color-primary)] rounded-l-full h-full" style="width: 40%"></div>
          <div class="bg-white rounded-r-full h-full ml-0.5" style="width: 60%"></div>
        </div>
        <div class="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span>In-Store (40%)</span>
          <span>Web Store (60%)</span>
        </div>
      </div>
    </div>

    <!-- 2. Total Revenue Card -->
    <div class="bg-gradient-to-br from-[var(--color-surface)] to-white border border-black/5 rounded-3xl p-6 space-y-3 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="text-xs text-neutral-500 uppercase tracking-wider font-mono">Total Revenue</span>
        <span class="text-xs font-mono font-semibold text-emerald-600">+12% vs last mo</span>
      </div>
      <p class="text-3xl font-bold text-neutral-900 font-mono">$12,000<span class="text-neutral-400 text-lg">.00</span></p>
      <!-- Mini sparkline -->
      <div class="h-10 flex items-end gap-1.5 pt-2">
        <div v-for="h in [40, 60, 30, 80, 50, 95, 70, 85]" :key="h" class="flex-1 bg-[var(--color-primary)]/80 rounded-t-sm" :style="{ height: `${h}%` }"></div>
      </div>
    </div>

    <!-- 3. Total Orders Card -->
    <div class="bg-white border border-black/5 rounded-3xl p-6 space-y-4 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="text-xs text-neutral-500 uppercase tracking-wider font-mono">Total Orders</span>
        <span class="text-xs font-mono font-semibold text-emerald-600">+17%</span>
      </div>
      <p class="text-3xl font-bold text-neutral-900 font-mono">824</p>
      <div class="flex items-center gap-2 text-xs text-neutral-500">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>98.4% fulfillment success rate</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentation KPI Stack
</script>
