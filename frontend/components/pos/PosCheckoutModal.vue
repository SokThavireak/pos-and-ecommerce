<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div class="flex items-center justify-between pb-4 border-b border-black/5">
        <div>
          <h3 class="text-lg font-bold text-neutral-900">Checkout Terminal</h3>
          <p class="text-xs text-neutral-400 font-mono">Ticket #POS-{{ orderCounter }}</p>
        </div>
        <button @click="$emit('close')" class="text-neutral-400 hover:text-black font-mono">✕</button>
      </div>

      <!-- Payment Method Switcher -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="paymentMethod = 'CASH'"
          class="p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all"
          :class="paymentMethod === 'CASH' ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 hover:border-black'"
        >
          <svg class="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs font-semibold">Cash Tender</span>
        </button>

        <button
          @click="paymentMethod = 'CARD'"
          class="p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all"
          :class="paymentMethod === 'CARD' ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 hover:border-black'"
        >
          <svg class="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span class="text-xs font-semibold">Card Tap / NFC</span>
        </button>
      </div>

      <div class="bg-neutral-50 rounded-2xl p-4 space-y-2 text-xs font-mono">
        <div class="flex justify-between">
          <span class="text-neutral-500">Total Payable:</span>
          <span class="font-bold text-neutral-900">${{ total.toFixed(2) }}</span>
        </div>
        <div v-if="paymentMethod === 'CASH'" class="flex justify-between items-center pt-2 border-t border-black/5">
          <span class="text-neutral-700">Tendered:</span>
          <input
            type="number"
            v-model.number="tenderedAmount"
            placeholder="0.00"
            class="w-24 bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-right font-mono font-bold text-xs"
          />
        </div>
        <div v-if="paymentMethod === 'CASH' && tenderedAmount >= total" class="flex justify-between text-emerald-600 font-bold">
          <span>Change Due:</span>
          <span>${{ (tenderedAmount - total).toFixed(2) }}</span>
        </div>
      </div>

      <button
        @click="$emit('confirm', { method: paymentMethod, tendered: tenderedAmount })"
        :disabled="isProcessing"
        class="w-full py-4 bg-neutral-950 hover:bg-black text-white rounded-2xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
      >
        <svg v-if="isProcessing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span v-else>Complete Transaction & Print Receipt</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  show: boolean;
  orderCounter: number;
  total: number;
  isProcessing: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', payload: { method: string; tendered: number }): void;
}>();

const paymentMethod = ref('CASH');
const tenderedAmount = ref(100);
</script>
