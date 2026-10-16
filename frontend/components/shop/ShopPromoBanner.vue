<template>
  <div class="bg-[var(--color-surface)] border border-black/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
    <div class="space-y-2 text-center sm:text-left z-10">
      <span class="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] font-mono">Special Access</span>
      <h2 class="font-serif text-2xl sm:text-3xl font-medium text-neutral-900">
        Flash Clearance & Certified Lots
      </h2>
      <p class="text-xs text-neutral-600 max-w-md leading-relaxed font-light">
        Direct lab batches and seasonal apparel catalog backed by same-day courier dispatch.
      </p>
    </div>
    <div class="flex items-center gap-3 z-10 flex-shrink-0">
      <div class="text-right">
        <span class="text-[10px] font-mono text-neutral-500 uppercase block">Discount Tier</span>
        <span class="text-2xl font-serif font-bold text-neutral-900">Up to 30% OFF</span>
      </div>
      <NuxtLink
        to="/detail"
        class="px-5 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-[var(--color-primary)] transition-colors shadow-sm"
      >
        View Spotlight
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Promo banner slot
</script>
