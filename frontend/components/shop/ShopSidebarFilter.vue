<template>
  <aside class="lg:col-span-3 space-y-8 bg-white lg:bg-transparent p-6 lg:p-0 rounded-3xl border lg:border-none border-black/5">
    <!-- 1. Categories Widget -->
    <div class="space-y-3">
      <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-black/5 pb-2">
        Categories
      </h3>
      <ul class="space-y-2 text-sm text-neutral-600">
        <li
          v-for="cat in categories"
          :key="cat.slug"
          class="flex items-center justify-between cursor-pointer hover:text-[var(--color-primary)] transition-colors py-1"
          :class="{ 'font-semibold text-[var(--color-primary)]': selectedCategory === cat.slug }"
          @click="$emit('select-category', selectedCategory === cat.slug ? null : cat.slug)"
        >
          <span>{{ cat.name }}</span>
          <span class="text-xs bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-500 font-mono">{{ cat.count }}</span>
        </li>
      </ul>
    </div>

    <!-- 2. Price Filter Widget -->
    <div class="space-y-4">
      <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-black/5 pb-2">
        Price Filter
      </h3>
      <div class="space-y-2">
        <input
          type="range"
          min="20"
          max="250"
          :value="maxPrice"
          @input="$emit('update:maxPrice', Number(($event.target as HTMLInputElement).value))"
          class="w-full accent-[var(--color-primary)] cursor-pointer"
        />
        <div class="flex items-center justify-between text-xs text-neutral-600 font-mono">
          <span>$20</span>
          <span class="font-bold text-neutral-900">Up to ${{ maxPrice }}</span>
          <span>$250</span>
        </div>
      </div>
    </div>

    <!-- 3. Size Filter Widget -->
    <div class="space-y-3">
      <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-black/5 pb-2">
        Choose Size
      </h3>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="size in ['XS', 'S', 'M', 'L', 'XL', '2XL']"
          :key="size"
          @click="$emit('toggle-size', size)"
          class="py-1.5 text-xs font-mono rounded-lg border transition-all"
          :class="selectedSizes.includes(size) ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white border-neutral-200 text-neutral-700 hover:border-black'"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- 4. Featured Mini-Products -->
    <div class="space-y-4">
      <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-black/5 pb-2">
        Featured Mini
      </h3>
      <div class="space-y-3">
        <div
          v-for="p in miniFeatured"
          :key="p.id"
          class="flex items-center gap-3 group cursor-pointer"
          @click="$emit('add-to-cart', p)"
        >
          <img :src="p.imageUrl" :alt="p.name" class="w-12 h-12 rounded-xl object-cover bg-neutral-100 flex-shrink-0" />
          <div class="text-xs">
            <p class="font-medium text-neutral-900 group-hover:text-[var(--color-primary)] line-clamp-1">{{ p.name }}</p>
            <p class="text-neutral-500 font-mono font-semibold">${{ p.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  categories: Array<{ name: string; slug: string; count: number }>;
  selectedCategory: string | null;
  maxPrice: number;
  selectedSizes: string[];
  miniFeatured: Array<any>;
}>();

defineEmits<{
  (e: 'select-category', cat: string | null): void;
  (e: 'update:maxPrice', val: number): void;
  (e: 'toggle-size', size: string): void;
  (e: 'add-to-cart', item: any): void;
}>();
</script>
