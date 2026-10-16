<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
    <div class="flex items-center justify-between pb-4 border-b border-black/5">
      <div>
        <span class="text-[10px] font-mono text-purple-600 uppercase tracking-wider font-semibold">SECURITY PROTECTED ARCHIVE</span>
        <h2 class="text-lg font-bold text-neutral-900">Database Snapshot Export</h2>
        <p class="text-xs text-neutral-500 mt-0.5">
          Generate an immutable full-database JSON archive of users, categories, product catalog, orders, and branding.
        </p>
      </div>
      <span class="text-xs font-mono px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold border border-purple-200">
        Requires 2nd Password Confirmation
      </span>
    </div>

    <!-- Live Metrics Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-neutral-50 rounded-2xl p-4 border border-black/5 space-y-1">
        <span class="text-[10px] font-mono uppercase text-neutral-400">Total Users</span>
        <p class="text-xl font-bold font-mono text-neutral-900">{{ stats.users }}</p>
        <span class="text-[10px] text-neutral-500">4 RBAC roles</span>
      </div>
      <div class="bg-neutral-50 rounded-2xl p-4 border border-black/5 space-y-1">
        <span class="text-[10px] font-mono uppercase text-neutral-400">Categories</span>
        <p class="text-xl font-bold font-mono text-neutral-900">{{ stats.categories }}</p>
        <span class="text-[10px] text-neutral-500">Taxonomies</span>
      </div>
      <div class="bg-neutral-50 rounded-2xl p-4 border border-black/5 space-y-1">
        <span class="text-[10px] font-mono uppercase text-neutral-400">Catalog Items</span>
        <p class="text-xl font-bold font-mono text-neutral-900">{{ stats.products }}</p>
        <span class="text-[10px] text-neutral-500">Active SKUs</span>
      </div>
      <div class="bg-neutral-50 rounded-2xl p-4 border border-black/5 space-y-1">
        <span class="text-[10px] font-mono uppercase text-neutral-400">Order Tickets</span>
        <p class="text-xl font-bold font-mono text-neutral-900">{{ stats.orders }}</p>
        <span class="text-[10px] text-neutral-500">POS & Web</span>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
      <div class="text-xs text-neutral-500 space-y-0.5">
        <p>• Snapshot file formatted in compliant TypeORM JSON structure.</p>
        <p>• Compatible with standalone staging deployments and offline backup drives.</p>
      </div>

      <button
        @click="$emit('download-backup')"
        :disabled="isExporting"
        class="px-6 py-3 bg-neutral-950 text-white rounded-2xl text-xs font-semibold hover:bg-[var(--color-primary)] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
      >
        <svg v-if="isExporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download Full Database JSON (.json)</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: {
    users: number;
    categories: number;
    products: number;
    orders: number;
  };
  isExporting: boolean;
}>();

defineEmits<{
  (e: 'download-backup'): void;
}>();
</script>
