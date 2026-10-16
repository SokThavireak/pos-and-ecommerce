<template>
  <header class="w-full bg-[#fcfcfc] border-b border-black/5 sticky top-0 z-40 backdrop-blur-md bg-[#fcfcfc]/90">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <img
          v-if="themeStore.logoUrl && !logoLoadFailed"
          :src="themeStore.logoUrl"
          :alt="themeStore.storeName || 'biolabs'"
          @error="logoLoadFailed = true"
          class="h-9 w-auto max-w-[140px] object-contain rounded-xl transition-transform group-hover:scale-105"
        />
        <div
          v-else
          class="w-9 h-9 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105"
        >
          {{ (themeStore.storeName || 'b').charAt(0).toLowerCase() }}
        </div>
        <span class="font-bold tracking-tight text-xl text-neutral-900">{{ themeStore.storeName || 'biolabs' }}</span>
      </NuxtLink>

      <!-- Customer Storefront Navigation (Clean & Editorial) -->
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
        <NuxtLink to="/" class="hover:text-black transition-colors" active-class="text-black font-semibold">Home</NuxtLink>
        <NuxtLink to="/shop" class="hover:text-black transition-colors" active-class="text-black font-semibold">Shop Catalog</NuxtLink>
        <NuxtLink to="/orders" class="hover:text-black transition-colors flex items-center gap-1.5" active-class="text-black font-semibold">
          <span>My Orders</span>
          <span v-if="orderCount > 0" class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
        </NuxtLink>
        <NuxtLink to="/location" class="hover:text-black transition-colors" active-class="text-black font-semibold">Locations</NuxtLink>
        <NuxtLink to="/about" class="hover:text-black transition-colors" active-class="text-black font-semibold">About Us</NuxtLink>
      </nav>

      <!-- Action Buttons & Dashboard Switcher -->
      <div class="flex items-center gap-2.5">
        <!-- Cart -->
        <NuxtLink
          to="/cart"
          class="relative p-2.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
          aria-label="View Cart"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cartStore.totalQuantity > 0"
            class="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
          >
            {{ cartStore.totalQuantity }}
          </span>
        </NuxtLink>

        <!-- Role Badge & Account Profile Trigger -->
        <div v-if="authStore.user" class="flex items-center gap-2">
          <NuxtLink
            to="/admin/profile"
            class="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors text-xs"
            :title="`Logged in as ${authStore.user.fullName} (${authStore.currentRole})`"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-amber-500': authStore.isOwner,
                'bg-purple-500': authStore.isAdmin,
                'bg-emerald-500': authStore.isCashier,
                'bg-blue-500': authStore.isCustomer,
              }"
            ></span>
            <span class="font-mono font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
              {{ authStore.currentRole }}
            </span>
          </NuxtLink>

          <!-- Dedicated Logout Button -->
          <button
            @click="handleLogout"
            class="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-rose-600 bg-neutral-100 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 transition-colors flex items-center gap-1.5"
            title="Log Out"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>

        <NuxtLink
          v-else
          to="/login"
          class="px-5 py-2.5 rounded-full text-sm font-medium border border-neutral-200 hover:border-black transition-colors"
        >
          Sign In
        </NuxtLink>

        <!-- Single Dedicated Dashboard Button (For Staff / Admins / Owners / Cashiers) -->
        <NuxtLink
          v-if="authStore.user && authStore.currentRole !== 'CUSTOMER'"
          :to="dashboardDestination"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-neutral-950 text-white hover:bg-black shadow-sm transition-all group"
        >
          <svg class="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useThemeStore } from '~/stores/theme';
import { useCartStore } from '~/stores/cart';
import { useAuthStore } from '~/stores/auth';
import { useAlertStore } from '~/stores/alert';
import { useOrderStore } from '~/stores/order';

const themeStore = useThemeStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const orderStore = useOrderStore();

const logoLoadFailed = ref(false);
watch(() => themeStore.logoUrl, () => {
  logoLoadFailed.value = false;
});

const orderCount = computed(() => {
  return orderStore.getOrdersByUser(authStore.user?.email).length;
});

// Smart destination based on assigned role
const dashboardDestination = computed(() => {
  if (authStore.isOwner) return '/admin';
  if (authStore.isAdmin) return '/admin/settings';
  if (authStore.isCashier) return '/pos';
  return '/admin/operations';
});

async function handleLogout() {
  const confirmed = await alertStore.confirm({
    title: 'Sign Out Session',
    message: 'Are you sure you want to end your current session?',
    type: 'warning',
    confirmText: 'Sign Out',
  });

  if (confirmed) {
    authStore.logout();
    alertStore.info('You have been signed out successfully.', 'Signed Out');
    navigateTo('/login');
  }
}
</script>
