<template>
  <div class="min-h-screen flex flex-col bg-[#fcfcfc] text-[#141414] antialiased">
    <SiteHeader />

    <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
      <!-- Breadcrumb and Page Title -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <div class="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
            <NuxtLink to="/" class="hover:text-black transition-colors">Home</NuxtLink>
            <span>/</span>
            <span class="text-neutral-800">Order History & Invoices</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Your Orders</h1>
          <p class="text-xs text-neutral-500 mt-1">
            Review status, cold-chain tracking identifiers, item details, or request cancellations and refunds.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/shop"
            class="px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
          >
            ← Continue Shopping
          </NuxtLink>
        </div>
      </div>

      <!-- Filter Tabs by Status -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
          :class="activeFilter === filter.value ? 'bg-neutral-950 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
        >
          {{ filter.label }}
          <span class="ml-1 opacity-70 font-mono">({{ getFilterCount(filter.value) }})</span>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredOrders.length === 0"
        class="bg-white border border-black/5 rounded-3xl p-12 text-center space-y-4 shadow-xs"
      >
        <div class="w-16 h-16 rounded-3xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto text-2xl font-mono">
          📦
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-bold text-neutral-900">No orders found</h3>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto">
            {{ activeFilter === 'ALL' ? "You haven't placed any orders yet. Discover our precision peptide formulations in the shop catalog." : "No orders found matching the selected filter state." }}
          </p>
        </div>
        <NuxtLink
          to="/shop"
          class="inline-block px-6 py-2.5 bg-neutral-950 text-white rounded-full text-xs font-semibold hover:bg-black transition-colors"
        >
          Browse Shop
        </NuxtLink>
      </div>

      <!-- Order Cards List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white border border-black/5 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 transition-all hover:border-black/15"
        >
          <!-- Order Card Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-5">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-base text-neutral-900">{{ order.id }}</span>
                <span
                  class="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full"
                  :class="getStatusBadgeClass(order.status)"
                >
                  {{ formatStatusText(order.status) }}
                </span>
              </div>
              <p class="text-xs text-neutral-400 font-mono">
                Placed {{ order.createdAt }} • Recipient: {{ order.customerName }} ({{ order.userEmail }})
              </p>
            </div>

            <div class="flex items-center gap-2 sm:text-right">
              <div v-if="order.trackingNumber" class="text-left sm:text-right">
                <span class="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Tracking ID</span>
                <span class="text-xs font-mono font-semibold text-neutral-800">{{ order.trackingNumber }}</span>
              </div>
            </div>
          </div>

          <!-- Refund / Cancel Status Alerts if applicable -->
          <div
            v-if="order.status === 'CANCELLED' && order.cancelReason"
            class="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-center gap-2.5"
          >
            <span class="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-xs">✕</span>
            <span><strong>Order Cancelled:</strong> {{ order.cancelReason }}</span>
          </div>

          <div
            v-if="order.status === 'REFUND_REQUESTED'"
            class="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-2xl flex items-center gap-2.5"
          >
            <span class="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs">⚠️</span>
            <span><strong>Refund Pending Review:</strong> Our cold-chain inspection team is verifying: "{{ order.refundReason }}"</span>
          </div>

          <div
            v-if="order.status === 'REFUNDED'"
            class="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3.5 rounded-2xl flex items-center gap-2.5"
          >
            <span class="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">✓</span>
            <span><strong>Refund Processed:</strong> Funds returned to original payment source. {{ order.refundReason ? `Reason: ${order.refundReason}` : '' }}</span>
          </div>

          <!-- Items Breakdown -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-50/70 border border-black/5"
            >
              <img
                :src="item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100'"
                :alt="item.name"
                class="w-14 h-14 rounded-xl object-cover border border-black/5 bg-white flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-neutral-900 truncate">{{ item.name }}</h4>
                <p class="text-[11px] text-neutral-400 font-mono">{{ item.spec || 'Standard Unit' }}</p>
                <div class="flex items-center justify-between text-xs mt-1">
                  <span class="text-neutral-500 font-mono">Qty: {{ item.quantity }}</span>
                  <span class="font-bold text-neutral-900">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer: Financial Summary & Actions -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/5">
            <div class="flex items-center gap-4 text-xs font-mono">
              <span class="text-neutral-500">Subtotal: <strong class="text-neutral-900">${{ order.subtotal.toFixed(2) }}</strong></span>
              <span class="text-neutral-500">Tax: <strong class="text-neutral-900">${{ order.tax.toFixed(2) }}</strong></span>
              <span class="text-sm font-bold text-neutral-900">Total: ${{ order.total.toFixed(2) }}</span>
            </div>

            <!-- Customer Action Buttons -->
            <div class="flex items-center gap-2">
              <!-- Cancel Order (Available if PENDING) -->
              <button
                v-if="order.status === 'PENDING'"
                @click="openCancelModal(order)"
                class="px-4 py-2 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Cancel Order
              </button>

              <!-- Request Refund (Available if ACCEPTED or COMPLETED) -->
              <button
                v-if="order.status === 'ACCEPTED' || order.status === 'COMPLETED'"
                @click="openRefundModal(order)"
                class="px-4 py-2 rounded-full text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors"
              >
                Request Refund / Return
              </button>

              <!-- Reorder / Buy Again -->
              <button
                @click="reorderItems(order)"
                class="px-4 py-2 rounded-full text-xs font-semibold text-white bg-neutral-950 hover:bg-black transition-colors shadow-sm"
              >
                Reorder Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <SiteFooter />

    <!-- Prompt / Reason Modal for Cancel or Refund Request -->
    <div
      v-if="activeActionModal.show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0"
            :class="activeActionModal.mode === 'CANCEL' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
          >
            {{ activeActionModal.mode === 'CANCEL' ? '✕' : '↩' }}
          </div>
          <div>
            <h3 class="text-base font-bold text-neutral-900">
              {{ activeActionModal.mode === 'CANCEL' ? 'Cancel Order' : 'Request Refund / Return' }}
            </h3>
            <p class="text-xs text-neutral-500 mt-0.5">
              Order #{{ activeActionModal.order?.id }} • Total: ${{ activeActionModal.order?.total.toFixed(2) }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-neutral-700">
            {{ activeActionModal.mode === 'CANCEL' ? 'Reason for Cancellation:' : 'Detailed reason for return or refund request:' }}
          </label>
          <textarea
            v-model="activeActionModal.reason"
            rows="3"
            :placeholder="activeActionModal.mode === 'CANCEL' ? 'e.g. Ordered incorrect dosage formulation by mistake...' : 'e.g. Temperature indicator tag arrived expired / damaged packaging...'"
            class="w-full text-xs p-3.5 rounded-2xl bg-neutral-50 border border-black/10 focus:outline-none focus:ring-1 focus:ring-black resize-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-black/5">
          <button
            type="button"
            @click="activeActionModal.show = false"
            class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
          >
            Dismiss
          </button>
          <button
            type="button"
            @click="submitOrderAction"
            :disabled="!activeActionModal.reason.trim()"
            class="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all disabled:opacity-40"
            :class="activeActionModal.mode === 'CANCEL' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-neutral-950 hover:bg-black'"
          >
            {{ activeActionModal.mode === 'CANCEL' ? 'Confirm Cancellation' : 'Submit Refund Request' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore, type CustomerOrder, type OrderStatus } from '~/stores/order';
import { useCartStore } from '~/stores/cart';
import { useAlertStore } from '~/stores/alert';
import { useAuthStore } from '~/stores/auth';
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';

const orderStore = useOrderStore();
const cartStore = useCartStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();

const activeFilter = ref<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REFUND_REQUESTED' | 'CANCELLED'>('ALL');

const filterOptions = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending Processing', value: 'PENDING' },
  { label: 'Accepted & Dispatched', value: 'ACCEPTED' },
  { label: 'Completed Deliveries', value: 'COMPLETED' },
  { label: 'Refund Requested', value: 'REFUND_REQUESTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
] as const;

const userOrders = computed(() => {
  return orderStore.getOrdersByUser(authStore.user?.email);
});

const filteredOrders = computed(() => {
  if (activeFilter.value === 'ALL') return userOrders.value;
  return userOrders.value.filter((o) => o.status === activeFilter.value);
});

function getFilterCount(status: string) {
  if (status === 'ALL') return userOrders.value.length;
  return userOrders.value.filter((o) => o.status === status).length;
}

function getStatusBadgeClass(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800';
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-emerald-100 text-emerald-800';
    case 'CANCELLED':
      return 'bg-neutral-200 text-neutral-800';
    case 'REFUND_REQUESTED':
      return 'bg-rose-100 text-rose-800';
    case 'REFUNDED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
}

function formatStatusText(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return 'Pending Fulfillment';
    case 'ACCEPTED':
      return 'Dispatched / In Transit';
    case 'COMPLETED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Order Cancelled';
    case 'REFUND_REQUESTED':
      return 'Refund Under Review';
    case 'REFUNDED':
      return 'Refund Completed';
    default:
      return status;
  }
}

const activeActionModal = ref({
  show: false,
  mode: 'CANCEL' as 'CANCEL' | 'REFUND',
  order: null as CustomerOrder | null,
  reason: '',
});

function openCancelModal(order: CustomerOrder) {
  activeActionModal.value = {
    show: true,
    mode: 'CANCEL',
    order,
    reason: 'Client requested immediate cancellation before packaging dispatch.',
  };
}

function openRefundModal(order: CustomerOrder) {
  activeActionModal.value = {
    show: true,
    mode: 'REFUND',
    order,
    reason: '',
  };
}

function submitOrderAction() {
  if (!activeActionModal.value.order) return;
  const orderId = activeActionModal.value.order.id;

  if (activeActionModal.value.mode === 'CANCEL') {
    orderStore.cancelOrder(orderId, activeActionModal.value.reason);
    alertStore.success(`Order #${orderId} has been successfully cancelled.`, 'Order Cancelled');
  } else {
    orderStore.requestRefund(orderId, activeActionModal.value.reason);
    alertStore.info(
      `Refund request submitted for Order #${orderId}. Our cold-chain operations team will inspect and review your request shortly.`,
      'Refund Requested'
    );
  }

  activeActionModal.value.show = false;
}

function reorderItems(order: CustomerOrder) {
  for (const item of order.items) {
    cartStore.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl || '',
      quantity: item.quantity,
    });
  }
  alertStore.success(`Added ${order.items.length} items from #${order.id} into your cart!`, 'Items Reordered');
  navigateTo('/cart');
}
</script>
