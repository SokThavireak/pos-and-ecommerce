<template>
  <section class="lg:col-span-4 bg-white border border-black/5 rounded-3xl p-5 flex flex-col justify-between h-full shadow-lg overflow-hidden">
    <!-- Ticket Header -->
    <div class="border-b border-black/5 pb-3 flex items-center justify-between">
      <div>
        <h2 class="text-sm font-bold text-neutral-900 uppercase tracking-wider font-mono">Current Order</h2>
        <p class="text-[11px] text-neutral-400 font-mono">Ticket #POS-{{ orderCounter }}</p>
      </div>
      <button
        @click="$emit('clear-cart')"
        class="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Ticket Items Scroll Area -->
    <div class="flex-1 overflow-y-auto divide-y divide-black/5 my-2 pr-1">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-2">
        <svg class="w-10 h-10 text-neutral-300 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-xs font-medium">No items on current ticket</p>
        <p class="text-[10px]">Tap products on the left or scan barcode</p>
      </div>

      <div
        v-for="item in items"
        :key="item.id"
        class="py-2.5 flex items-center justify-between gap-2"
      >
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-neutral-900 truncate">{{ item.name }}</p>
          <p class="text-[10px] text-neutral-400 font-mono">${{ item.price.toFixed(2) }} each</p>
        </div>

        <!-- Quantity controls -->
        <div class="flex items-center gap-1.5 bg-neutral-100 rounded-full px-2 py-0.5">
          <button @click="$emit('decrease-item', item.id)" class="text-xs text-neutral-600 font-bold hover:text-black w-4 text-center">
            −
          </button>
          <span class="text-xs font-mono font-semibold w-5 text-center">{{ item.quantity }}</span>
          <button @click="$emit('increase-item', item)" class="text-xs text-neutral-600 font-bold hover:text-black w-4 text-center">
            +
          </button>
        </div>

        <div class="text-right w-14 font-mono font-bold text-xs text-neutral-900">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Calculations & Totals -->
    <div class="border-t border-black/5 pt-3 space-y-1.5 text-xs font-mono">
      <div class="flex justify-between text-neutral-500">
        <span>Subtotal</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-neutral-500">
        <span>Discount (0%)</span>
        <span>$0.00</span>
      </div>
      <div class="flex justify-between text-neutral-500">
        <span>Tax (8%)</span>
        <span>${{ tax.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-dashed border-black/10">
        <span>Total Due</span>
        <span class="text-[var(--color-primary)] font-mono">${{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Payment Trigger Button -->
    <div class="pt-4">
      <button
        @click="$emit('open-checkout')"
        :disabled="items.length === 0"
        class="w-full py-3.5 bg-neutral-950 hover:bg-black text-white rounded-2xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group"
      >
        <span>Proceed to Payment</span>
        <span class="font-mono text-emerald-400 font-bold">(${{ total.toFixed(2) }})</span>
        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  items: Array<any>;
  orderCounter: number;
}>();

defineEmits<{
  (e: 'clear-cart'): void;
  (e: 'increase-item', item: any): void;
  (e: 'decrease-item', id: string): void;
  (e: 'open-checkout'): void;
}>();

const subtotal = computed(() => props.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
const tax = computed(() => subtotal.value * 0.08);
const total = computed(() => subtotal.value + tax.value);
</script>
