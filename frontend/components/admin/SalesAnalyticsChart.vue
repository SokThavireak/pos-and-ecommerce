<template>
  <div class="lg:col-span-8 bg-white border border-black/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xs">
    <div class="flex items-center justify-between pb-6 border-b border-black/5">
      <div>
        <h2 class="text-base font-bold text-neutral-900">Sales Analytics</h2>
        <div class="flex items-center gap-4 text-xs text-neutral-500 mt-1">
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"></span> POS Counter
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]/40"></span> Web Storefront
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs bg-neutral-100 px-3 py-1.5 rounded-full font-medium text-neutral-700">This year</span>
      </div>
    </div>

    <!-- 12-Month Vertical Bar Chart with Hover Tooltip -->
    <div class="py-8 relative">
      <!-- Simulated Dark Floating Tooltip on July -->
      <div class="hidden sm:flex flex-col items-center absolute -top-2 left-[54%] -translate-x-1/2 z-20 pointer-events-none">
        <div class="bg-[#141414] text-white text-[11px] font-mono px-3 py-1.5 rounded-xl shadow-xl flex flex-col items-center">
          <span class="text-neutral-400 text-[9px]">July Peak</span>
          <span class="font-bold text-[var(--color-primary)]">$16,420.00</span>
        </div>
        <div class="w-2 h-2 bg-[#141414] rotate-45 -mt-1"></div>
      </div>

      <!-- Vertical Bar Chart -->
      <div class="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
        <div
          v-for="bar in bars"
          :key="bar.month"
          class="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
        >
          <div class="w-full flex items-end gap-1 h-full justify-center">
            <!-- Secondary bar -->
            <div
              class="w-full max-w-[14px] bg-[var(--color-primary)]/40 rounded-t-lg transition-all duration-300 group-hover:opacity-80"
              :style="{ height: `${bar.web}%` }"
            ></div>
            <!-- Primary bar -->
            <div
              class="w-full max-w-[14px] bg-[var(--color-primary)] rounded-t-lg transition-all duration-300 group-hover:brightness-110"
              :style="{ height: `${bar.pos}%` }"
            ></div>
          </div>
          <span class="text-[11px] text-neutral-400 font-mono group-hover:text-neutral-900 transition-colors">{{ bar.month }}</span>
        </div>
      </div>
    </div>

    <div class="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-neutral-500 font-mono">
      <span>Aggregated 2026 sales across all channels</span>
      <span class="font-bold text-neutral-900">$184,920.00 total</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bars: Array<{ month: string; pos: number; web: number }>;
}>();
</script>
