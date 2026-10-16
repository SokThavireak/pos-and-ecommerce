<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between pb-3 border-b border-black/5">
        <div>
          <h3 class="text-base font-bold text-neutral-900">Edit Category</h3>
          <p class="text-xs text-neutral-500 font-mono">ID: {{ category.id }}</p>
        </div>
        <button @click="$emit('close')" class="text-neutral-400 hover:text-black font-mono">✕</button>
      </div>

      <form @submit.prevent="$emit('save')" class="space-y-3.5 text-xs">
        <div>
          <label class="block text-neutral-700 font-medium mb-1">Category Name</label>
          <input
            type="text"
            v-model="category.name"
            required
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Slug</label>
          <input
            type="text"
            v-model="category.slug"
            required
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Description</label>
          <textarea
            v-model="category.description"
            rows="2"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Badge Color Tint</label>
          <div class="flex items-center gap-2">
            <button
              v-for="color in colorPresets"
              :key="color.value"
              type="button"
              @click="category.tint = color.value"
              class="w-7 h-7 rounded-full border-2 transition-transform"
              :class="category.tint === color.value ? 'scale-110 border-black' : 'border-transparent'"
              :style="{ backgroundColor: color.hex }"
              :title="color.label"
            ></button>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-black/5">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-neutral-950 text-white rounded-xl font-semibold hover:bg-[var(--color-primary)] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  category: any;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'save'): void;
}>();

const colorPresets = [
  { label: 'Emerald', value: 'emerald', hex: '#10b981' },
  { label: 'Indigo', value: 'indigo', hex: '#6366f1' },
  { label: 'Amber', value: 'amber', hex: '#f59e0b' },
  { label: 'Rose', value: 'rose', hex: '#f43f5e' },
  { label: 'Neutral', value: 'neutral', hex: '#404040' },
];
</script>
