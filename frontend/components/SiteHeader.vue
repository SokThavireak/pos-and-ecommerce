<template>
  <header class="w-full bg-[#fcfcfc] border-b border-black/5 sticky top-0 z-40 backdrop-blur-md bg-[#fcfcfc]/90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
      <!-- Left: Mobile Menu Toggle & Brand Logo -->
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <!-- Mobile Hamburger Menu Button -->
        <button
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 -ml-1 text-neutral-700 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Brand Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group truncate" @click="mobileMenuOpen = false">
          <img
            v-if="themeStore.logoUrl && !logoLoadFailed"
            :src="themeStore.logoUrl"
            :alt="themeStore.storeName || 'biolabs'"
            @error="logoLoadFailed = true"
            class="h-8 sm:h-9 w-auto max-w-[110px] sm:max-w-[140px] object-contain rounded-xl transition-transform group-hover:scale-105 shrink-0"
          />
          <div
            v-else
            class="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm transition-transform group-hover:scale-105 shrink-0"
          >
            {{ (themeStore.storeName || 'b').charAt(0).toLowerCase() }}
          </div>
          <span
            v-if="!themeStore.logoUrl || logoLoadFailed"
            class="font-bold tracking-tight text-lg sm:text-xl text-neutral-900 truncate"
          >
            {{ themeStore.storeName || 'biolabs' }}
          </span>
        </NuxtLink>
      </div>

      <!-- Customer Storefront Navigation (Desktop) -->
      <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-neutral-600">
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
      <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <!-- Cart -->
        <NuxtLink
          to="/cart"
          class="relative p-2 sm:p-2.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
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
        <div v-if="authStore.user" class="flex items-center gap-1.5 sm:gap-2">
          <NuxtLink
            to="/admin/profile"
            class="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors text-xs"
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
            <span class="font-mono font-bold text-neutral-800 uppercase tracking-wider text-[10px] sm:text-[11px]">
              {{ authStore.currentRole }}
            </span>
          </NuxtLink>

          <!-- Dedicated Logout Button -->
          <button
            @click="handleLogout"
            class="p-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-rose-600 bg-neutral-100 hover:bg-rose-50 border border-neutral-200 hover:border-rose-200 transition-colors flex items-center gap-1.5"
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
          class="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-neutral-200 hover:border-black transition-colors"
        >
          Sign In
        </NuxtLink>

        <!-- Single Dedicated Dashboard Button (For Staff / Admins / Owners / Cashiers) -->
        <NuxtLink
          v-if="authStore.user && authStore.currentRole !== 'CUSTOMER'"
          :to="dashboardDestination"
          class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs font-semibold bg-neutral-950 text-white hover:bg-black shadow-sm transition-all group"
        >
          <svg class="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="hidden sm:inline">Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile Navigation Drawer & Backdrop (Overlay on top of content) -->
    <Teleport to="body">
      <!-- Dimmed Backdrop with Blur -->
      <transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          @click="mobileMenuOpen = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          aria-hidden="true"
        ></div>
      </transition>

      <!-- Floating Drawer / Overlay Panel -->
      <transition
        enter-active-class="transition duration-300 ease-out transform"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed top-16 left-3 right-3 sm:left-4 sm:right-4 z-50 md:hidden bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-neutral-200/80 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-neutral-100">
            <span class="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">Store Menu</span>
            <button
              @click="mobileMenuOpen = false"
              class="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
              aria-label="Close menu"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <NuxtLink
            to="/"
            class="flex items-center justify-between py-3 px-4 rounded-2xl text-neutral-800 hover:text-black hover:bg-neutral-100 font-medium text-sm transition-all"
            active-class="bg-neutral-100 text-black font-semibold shadow-sm"
            @click="mobileMenuOpen = false"
          >
            <span>Home</span>
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="flex items-center justify-between py-3 px-4 rounded-2xl text-neutral-800 hover:text-black hover:bg-neutral-100 font-medium text-sm transition-all"
            active-class="bg-neutral-100 text-black font-semibold shadow-sm"
            @click="mobileMenuOpen = false"
          >
            <span>Shop Catalog</span>
          </NuxtLink>
          <NuxtLink
            to="/orders"
            class="flex items-center justify-between py-3 px-4 rounded-2xl text-neutral-800 hover:text-black hover:bg-neutral-100 font-medium text-sm transition-all"
            active-class="bg-neutral-100 text-black font-semibold shadow-sm"
            @click="mobileMenuOpen = false"
          >
            <span>My Orders</span>
            <span v-if="orderCount > 0" class="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-sm">
              {{ orderCount }}
            </span>
          </NuxtLink>
          <NuxtLink
            to="/location"
            class="flex items-center justify-between py-3 px-4 rounded-2xl text-neutral-800 hover:text-black hover:bg-neutral-100 font-medium text-sm transition-all"
            active-class="bg-neutral-100 text-black font-semibold shadow-sm"
            @click="mobileMenuOpen = false"
          >
            <span>Locations</span>
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="flex items-center justify-between py-3 px-4 rounded-2xl text-neutral-800 hover:text-black hover:bg-neutral-100 font-medium text-sm transition-all"
            active-class="bg-neutral-100 text-black font-semibold shadow-sm"
            @click="mobileMenuOpen = false"
          >
            <span>About Us</span>
          </NuxtLink>

          <!-- Staff / Admin Action Area inside drawer -->
          <div v-if="authStore.user && authStore.currentRole !== 'CUSTOMER'" class="pt-3 border-t border-neutral-100">
            <NuxtLink
              :to="dashboardDestination"
              class="flex items-center justify-between py-3 px-4 rounded-2xl text-white bg-neutral-900 hover:bg-black font-semibold text-sm transition-all shadow-md"
              @click="mobileMenuOpen = false"
            >
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Staff Dashboard</span>
              </div>
              <span class="text-xs uppercase text-neutral-400 font-mono">{{ authStore.currentRole }}</span>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </Teleport>
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

const mobileMenuOpen = ref(false);

// Lock body scrolling when mobile menu is active so background content doesn't move or respond
watch(mobileMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }
});

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
