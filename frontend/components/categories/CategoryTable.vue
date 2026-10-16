<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h3 class="text-base font-bold text-neutral-900">Existing Categories</h3>
        <p class="text-xs text-neutral-500">{{ categories.length }} category taxonomies active</p>
      </div>

      <div class="relative w-full sm:w-56">
        <input
          type="text"
          v-model="search"
          placeholder="Search category or slug..."
          class="w-full bg-neutral-100 text-xs px-3.5 py-1.5 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
    </div>

    <!-- Category Rows -->
    <div class="divide-y divide-black/5">
      <div
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/60 transition-colors rounded-xl px-2"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase"
            :class="{
              'bg-emerald-100 text-emerald-800': cat.tint === 'emerald',
              'bg-indigo-100 text-indigo-800': cat.tint === 'indigo',
              'bg-amber-100 text-amber-800': cat.tint === 'amber',
              'bg-rose-100 text-rose-800': cat.tint === 'rose',
              'bg-neutral-200 text-neutral-800': !cat.tint || cat.tint === 'neutral',
            }"
          >
            {{ cat.name.slice(0, 2) }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-xs font-semibold text-neutral-900">{{ cat.name }}</p>
              <span class="text-[10px] font-mono px-2 py-0.2 bg-neutral-100 text-neutral-600 rounded-md">
                /{{ cat.slug }}
              </span>
            </div>
            <p class="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{{ cat.description || 'No description provided' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs font-mono font-medium text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-lg border border-black/5">
            {{ cat.productCount || 0 }} items
          </span>
          <button
            @click="$emit('edit-category', cat)"
            class="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
          >
            Edit
          </button>
          <button
            @click="$emit('delete-category', cat.id)"
            class="text-neutral-400 hover:text-red-600 p-1 transition-colors"
            title="Delete category"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    productCount?: number;
    tint?: string;
  }>;
}>();

defineEmits<{
  (e: 'edit-category', cat: any): void;
  (e: 'delete-category', id: string): void;
}>();

const search = ref('');

const filteredCategories = computed(() => {
  if (!search.value) return props.categories;
  const q = search.value.toLowerCase();
  return props.categories.filter(
    (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
  );
});
</script>
