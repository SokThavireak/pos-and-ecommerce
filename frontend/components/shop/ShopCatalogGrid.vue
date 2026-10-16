<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    <div
      v-for="product in products"
      :key="product.id"
      class="group flex flex-col bg-white rounded-3xl border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div class="relative aspect-square bg-[var(--color-surface)] overflow-hidden flex items-center justify-center p-6">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute top-4 left-4 flex flex-col gap-1.5">
          <span v-if="product.tag" class="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm text-white font-semibold">
            {{ product.tag }}
          </span>
          <span v-if="product.oldPrice" class="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold">
            Sale
          </span>
        </div>
        <div class="absolute inset-x-4 bottom-4 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            @click="$emit('add-to-cart', product)"
            class="flex-1 py-3 bg-neutral-900/90 backdrop-blur-md text-white rounded-2xl text-xs font-semibold hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Add to Bag
          </button>
          <NuxtLink
            to="/detail"
            class="p-3 bg-white/90 backdrop-blur-md text-neutral-900 rounded-2xl hover:bg-white transition-colors shadow-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div class="space-y-1">
          <span class="text-[11px] font-mono uppercase text-neutral-400">{{ product.category }}</span>
          <h3 class="font-medium text-sm text-neutral-900 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
            {{ product.name }}
          </h3>
          <p class="text-xs text-neutral-500 font-mono">{{ product.spec }}</p>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-black/5">
          <div class="flex items-baseline gap-2">
            <span class="font-mono text-base font-bold text-neutral-900">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.oldPrice" class="font-mono text-xs text-neutral-400 line-through">
              ${{ product.oldPrice.toFixed(2) }}
            </span>
          </div>
          <span class="text-[10px] font-mono text-neutral-400">{{ product.stock }} in stock</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  products: Array<any>;
}>();

defineEmits<{
  (e: 'add-to-cart', product: any): void;
}>();
</script>
