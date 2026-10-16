<template>
  <div class="space-y-4">
    <!-- Grid Cards Skeleton (Shop / Catalog / POS) -->
    <div v-if="type === 'card-grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      <div
        v-for="i in count"
        :key="i"
        class="bg-white rounded-3xl p-4 border border-black/5 space-y-3 shadow-xs"
      >
        <div class="aspect-square bg-neutral-200/70 rounded-2xl w-full"></div>
        <div class="space-y-2 pt-1">
          <div class="h-3.5 bg-neutral-200/80 rounded-md w-3/4"></div>
          <div class="h-3 bg-neutral-100 rounded-md w-1/2"></div>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-black/5">
          <div class="h-4 bg-neutral-200/80 rounded-md w-16"></div>
          <div class="h-3 bg-neutral-100 rounded-md w-12"></div>
        </div>
      </div>
    </div>

    <!-- Table Rows Skeleton (Admin Operations / Audit / Stock) -->
    <div v-else-if="type === 'table'" class="bg-white rounded-3xl p-6 border border-black/5 space-y-4 animate-pulse shadow-xs">
      <div class="flex items-center justify-between pb-3 border-b border-black/5">
        <div class="h-4 bg-neutral-200 rounded-md w-44"></div>
        <div class="h-3 bg-neutral-100 rounded-md w-28"></div>
      </div>
      <div class="divide-y divide-black/5 space-y-3">
        <div v-for="i in count" :key="i" class="pt-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-10 h-10 rounded-xl bg-neutral-200 flex-shrink-0"></div>
            <div class="space-y-1.5 flex-1 max-w-sm">
              <div class="h-3.5 bg-neutral-200 rounded-md w-3/4"></div>
              <div class="h-2.5 bg-neutral-100 rounded-md w-1/2"></div>
            </div>
          </div>
          <div class="h-3.5 bg-neutral-200 rounded-md w-20"></div>
          <div class="h-6 bg-neutral-100 rounded-lg w-16"></div>
        </div>
      </div>
    </div>

    <!-- Touch POS Cards Skeleton -->
    <div v-else-if="type === 'pos-grid'" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 animate-pulse">
      <div v-for="i in count" :key="i" class="bg-white rounded-2xl p-3 border border-black/5 space-y-2">
        <div class="aspect-square bg-neutral-200/70 rounded-xl w-full"></div>
        <div class="h-3 bg-neutral-200 rounded-md w-3/4"></div>
        <div class="h-3 bg-neutral-100 rounded-md w-1/2"></div>
      </div>
    </div>

    <!-- Generic Single Block Skeleton -->
    <div v-else class="animate-pulse space-y-3">
      <div class="h-6 bg-neutral-200 rounded-xl w-1/3"></div>
      <div class="h-24 bg-neutral-100 rounded-2xl w-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'card-grid' | 'table' | 'pos-grid' | 'block';
    count?: number;
  }>(),
  {
    type: 'card-grid',
    count: 6,
  }
);
</script>
