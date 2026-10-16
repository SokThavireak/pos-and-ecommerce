<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">FULFILLMENT QUEUE</span>
        <h2 class="text-xl font-bold text-neutral-900">Incoming Orders & Counter Dispatch</h2>
        <p class="text-xs text-neutral-500">Accept web storefront reservations, confirm in-store pickups, and trigger packing.</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs bg-amber-50 text-amber-800 font-mono font-semibold px-3 py-1 rounded-full border border-amber-200">
          {{ pendingCount }} Pending Confirmation
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border border-black/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
      >
        <div class="space-y-1.5 flex-1">
          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-sm text-neutral-900">{{ order.id }}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold"
              :class="order.source === 'POS' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'"
            >
              {{ order.source }}
            </span>
            <span class="text-xs text-neutral-400 font-mono">• {{ order.createdAt }}</span>
          </div>
          <p class="text-xs font-semibold text-neutral-800">
            Customer: {{ order.customer }} <span class="font-normal text-neutral-500">({{ order.email }})</span>
          </p>
          <p class="text-xs text-neutral-600 font-mono">
            Items: {{ order.itemsSummary }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-bold font-mono text-neutral-900">${{ order.totalAmount.toFixed(2) }}</p>
            <span
              class="text-[10px] font-mono font-semibold"
              :class="{
                'text-amber-600': order.status === 'PENDING',
                'text-blue-600': order.status === 'ACCEPTED',
                'text-emerald-600': order.status === 'COMPLETED',
                'text-rose-600': order.status === 'REJECTED',
                'text-orange-600': order.status === 'FAILED',
              }"
            >
              Status: {{ order.status }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- PENDING State Actions -->
            <template v-if="order.status === 'PENDING'">
              <button
                @click="$emit('update-status', order.id, 'ACCEPTED')"
                class="px-3.5 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors"
              >
                Accept Order
              </button>
              <button
                @click="$emit('update-status', order.id, 'REJECTED')"
                class="px-3 py-1.5 bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                title="Reject incoming order"
              >
                Reject ✕
              </button>
            </template>

            <!-- ACCEPTED State Actions -->
            <template v-if="order.status === 'ACCEPTED'">
              <button
                @click="$emit('update-status', order.id, 'COMPLETED')"
                class="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Mark Dispatched
              </button>
              <button
                @click="$emit('update-status', order.id, 'FAILED')"
                class="px-3 py-1.5 bg-amber-100 hover:bg-amber-600 hover:text-white text-amber-800 rounded-xl text-xs font-semibold transition-colors"
                title="Mark order fulfillment failed / delivery issue"
              >
                Failed ⚠
              </button>
            </template>

            <!-- TERMINAL States -->
            <button
              v-if="order.status === 'COMPLETED'"
              class="px-3 py-1.5 bg-neutral-100 text-neutral-500 rounded-xl text-xs font-mono cursor-default"
            >
              Fulfilled ✓
            </button>
            <button
              v-if="order.status === 'REJECTED'"
              class="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-mono cursor-default border border-rose-200"
            >
              Rejected ✕
            </button>
            <button
              v-if="order.status === 'FAILED'"
              class="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-mono cursor-default border border-amber-200"
            >
              Failed ⚠
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  orders: Array<{
    id: string;
    source: string;
    customer: string;
    email: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    itemsSummary: string;
  }>;
}>();

defineEmits<{
  (e: 'update-status', orderId: string, newStatus: string): void;
}>();

const pendingCount = computed(() => props.orders.filter((o) => o.status === 'PENDING').length);
</script>
