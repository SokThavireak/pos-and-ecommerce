<template>
  <div class="flex-1 flex flex-col min-h-screen bg-[#fcfcfc]">
    <SiteHeader />

    <!-- Subheader Header Banner -->
    <section class="w-full bg-[#f4f5f7] border-b border-black/5 py-10">
      <div class="max-w-7xl mx-auto px-6 text-center space-y-2">
        <h1 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900">Your Shopping Bag</h1>
        <div class="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
          <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/shop" class="hover:text-black">Shop</NuxtLink>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">Cart</span>
        </div>
      </div>
    </section>

    <!-- Main Cart Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full flex-1">
      <!-- Empty Cart State -->
      <div
        v-if="cartStore.items.length === 0"
        class="bg-white rounded-3xl border border-black/5 p-12 text-center max-w-xl mx-auto space-y-5 shadow-xs"
      >
        <div class="w-20 h-20 rounded-3xl bg-neutral-50 flex items-center justify-center mx-auto text-neutral-400 border border-black/5">
          <svg class="w-10 h-10 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="space-y-1.5">
          <h2 class="text-xl font-bold text-neutral-900">Your Shopping Bag is Empty</h2>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            You haven't added any precision peptides, apparel, or laboratory supplies to your bag yet.
          </p>
        </div>
        <div class="pt-2">
          <NuxtLink
            to="/shop"
            class="px-8 py-3.5 bg-neutral-950 text-white hover:bg-[var(--color-primary)] rounded-full text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-2"
          >
            <span>Explore Catalog</span>
            <span>→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Active Cart Grid (8 cols Items + 4 cols Order Summary) -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Cart Items List (8 cols) -->
        <div class="lg:col-span-8 bg-white rounded-3xl border border-black/5 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-black/5">
            <div>
              <h2 class="text-lg font-bold text-neutral-900">Bag Items</h2>
              <p class="text-xs text-neutral-400 font-mono">{{ cartStore.totalQuantity }} items in cart</p>
            </div>
            <button
              @click="cartStore.clearCart()"
              class="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              Clear Bag
            </button>
          </div>

          <!-- Items Table -->
          <div class="divide-y divide-black/5">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4 flex-1">
                <img
                  :src="item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'"
                  :alt="item.name"
                  class="w-16 h-16 rounded-2xl object-contain bg-[var(--color-surface)] p-2 border border-black/5 flex-shrink-0"
                />
                <div class="space-y-0.5">
                  <h3 class="font-semibold text-sm text-neutral-900 line-clamp-1">{{ item.name }}</h3>
                  <p class="text-xs text-neutral-400 font-mono">{{ item.spec || item.sku }}</p>
                  <p class="text-xs font-mono font-bold text-neutral-900 sm:hidden">
                    ${{ item.price.toFixed(2) }} each
                  </p>
                </div>
              </div>

              <!-- Quantity Controls & Line Total -->
              <div class="flex items-center justify-between sm:justify-end gap-6">
                <!-- Quantity Switcher -->
                <div class="flex items-center gap-2 bg-neutral-100 rounded-full px-3 py-1">
                  <button
                    @click="cartStore.decreaseItem(item.id)"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-black hover:bg-white transition-colors"
                  >
                    −
                  </button>
                  <span class="w-8 text-center font-mono font-bold text-xs text-neutral-900">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="cartStore.addItem(item)"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-neutral-600 hover:text-black hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <!-- Price -->
                <div class="text-right w-24">
                  <p class="font-mono font-bold text-sm text-neutral-900">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                  <p class="text-[10px] text-neutral-400 font-mono hidden sm:block">
                    ${{ item.price.toFixed(2) }} each
                  </p>
                </div>

                <!-- Remove Button -->
                <button
                  @click="cartStore.removeItem(item.id)"
                  class="text-neutral-400 hover:text-rose-600 p-1.5 transition-colors"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary Card (4 cols) -->
        <div class="lg:col-span-4 bg-white rounded-3xl border border-black/5 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 class="text-lg font-bold text-neutral-900 pb-3 border-b border-black/5">Order Summary</h2>

          <!-- Pricing Ledger -->
          <div class="space-y-2.5 text-xs font-mono">
            <div class="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span class="font-bold text-neutral-900">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span>Estimated Shipping:</span>
              <span class="text-emerald-700 font-semibold">Complimentary</span>
            </div>
            <div class="flex justify-between text-neutral-600">
              <span>Estimated Tax (8%):</span>
              <span class="font-bold text-neutral-900">${{ (cartStore.subtotal * 0.08).toFixed(2) }}</span>
            </div>
            <div class="pt-3 border-t border-dashed border-black/10 flex justify-between text-base font-bold text-neutral-900">
              <span>Total:</span>
              <span class="text-[var(--color-primary)] font-mono">
                ${{ (cartStore.subtotal * 1.08).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Checkout Action -->
          <button
            @click="handleCheckout"
            :disabled="isCheckingOut"
            class="w-full py-4 bg-neutral-950 text-white hover:bg-black rounded-2xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <svg v-if="isCheckingOut" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-else>Proceed to Secure Checkout</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <!-- Safe Checkout Guarantees -->
          <div class="border-t border-black/5 pt-4 space-y-2 text-[11px] text-neutral-500">
            <p class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Same-day dispatch & batch tracking
            </p>
            <p class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Verified cold-chain packaging
            </p>
            <p class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> 256-bit encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '~/stores/cart';
import { useAlertStore } from '~/stores/alert';
import { useOrderStore } from '~/stores/order';
import { useAuthStore } from '~/stores/auth';
import SiteHeader from '~/components/SiteHeader.vue';
import SiteFooter from '~/components/SiteFooter.vue';

const cartStore = useCartStore();
const alertStore = useAlertStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const isCheckingOut = ref(false);

async function handleCheckout() {
  if (cartStore.items.length === 0) return;
  isCheckingOut.value = true;
  await new Promise((r) => setTimeout(r, 700));

  const total = Number((cartStore.subtotal * 1.08).toFixed(2));
  const newOrder = orderStore.createOrder({
    customerName: authStore.user?.fullName || 'Guest Customer',
    userEmail: authStore.user?.email || 'customer@biolabs.com',
    items: [...cartStore.items],
    subtotal: cartStore.subtotal,
    tax: Number((cartStore.subtotal * 0.08).toFixed(2)),
    total,
  });

  alertStore.success(`Your order #${newOrder.id} of $${total.toFixed(2)} has been placed and received by our fulfillment queue!`, 'Order Placed');
  cartStore.clearCart();
  isCheckingOut.value = false;
  navigateTo('/orders');
}
</script>
