<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
    <div>
      <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">TAXONOMY BUILDER</span>
      <h2 class="text-lg font-bold text-neutral-900">Create New Category</h2>
      <p class="text-xs text-neutral-500 mt-0.5">Organize items into collections visible across Web Storefront, POS counter, and item editors.</p>
    </div>

    <form @submit.prevent="handleCreate" class="space-y-3.5 text-xs">
      <div>
        <label class="block text-neutral-700 font-medium mb-1">Category Name</label>
        <input
          type="text"
          v-model="newCat.name"
          @input="autoGenerateSlug"
          required
          placeholder="e.g. Nootropics & Cognition"
          class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
        />
      </div>

      <div>
        <label class="block text-neutral-700 font-medium mb-1">Slug (URL / Route Key)</label>
        <input
          type="text"
          v-model="newCat.slug"
          required
          placeholder="nootropics-cognition"
          class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
        />
      </div>

      <div>
        <label class="block text-neutral-700 font-medium mb-1">Description / Subtitle</label>
        <textarea
          v-model="newCat.description"
          rows="2"
          placeholder="Clinical focus, bio-active elements, and lot documentation..."
          class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
        ></textarea>
      </div>

      <div>
        <label class="block text-neutral-700 font-medium mb-1">Badge Color Tint</label>
        <div class="flex items-center gap-2">
          <button
            v-for="color in colorPresets"
            :key="color.value"
            type="button"
            @click="newCat.tint = color.value"
            class="w-7 h-7 rounded-full border-2 transition-transform"
            :class="newCat.tint === color.value ? 'scale-110 border-black' : 'border-transparent'"
            :style="{ backgroundColor: color.hex }"
            :title="color.label"
          ></button>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-neutral-950 text-white rounded-xl font-semibold text-xs hover:bg-[var(--color-primary)] transition-colors shadow-sm mt-2"
      >
        Save & Publish Category
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits<{
  (e: 'create-category', payload: { name: string; slug: string; description: string; tint: string }): void;
}>();

const newCat = reactive({
  name: '',
  slug: '',
  description: '',
  tint: 'emerald',
});

const colorPresets = [
  { label: 'Emerald', value: 'emerald', hex: '#10b981' },
  { label: 'Indigo', value: 'indigo', hex: '#6366f1' },
  { label: 'Amber', value: 'amber', hex: '#f59e0b' },
  { label: 'Rose', value: 'rose', hex: '#f43f5e' },
  { label: 'Neutral', value: 'neutral', hex: '#404040' },
];

function autoGenerateSlug() {
  newCat.slug = newCat.name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function handleCreate() {
  if (!newCat.name.trim()) return;
  emit('create-category', { ...newCat });
  newCat.name = '';
  newCat.slug = '';
  newCat.description = '';
  newCat.tint = 'emerald';
}
</script>
