<template>
  <aside class="w-16 h-full bg-[#141414] text-white rounded-3xl flex flex-col items-center py-6 justify-between shadow-2xl flex-shrink-0 z-30 select-none">
    <!-- Brand Friendly Logo: Quick Return Back to Customer Storefront -->
    <div class="flex flex-col items-center gap-6">
      <NuxtLink
        to="/"
        class="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        title="Return to Customer Storefront"
      >
        <img
          v-if="themeStore.logoUrl && !logoLoadFailed"
          :src="themeStore.logoUrl"
          alt="Logo"
          @error="logoLoadFailed = true"
          class="w-full h-full object-cover rounded-2xl"
        />
        <span v-else>
          {{ (themeStore.storeName || 'b').charAt(0).toLowerCase() }}
        </span>
        <!-- Friendly Tooltip on hover -->
        <span class="absolute left-14 bg-neutral-900 text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
          ← Return to Storefront
        </span>
      </NuxtLink>

      <!-- Navigation Icons (Focused strictly on active role duties) -->
      <nav class="flex flex-col items-center gap-3.5 text-neutral-400">
        <!-- 0. Quick Return Home Storefront ('/') Button -->
        <NuxtLink
          to="/"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/' }"
          title="Home Storefront"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <!-- Tooltip on hover -->
          <span class="absolute left-14 bg-neutral-900 text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
            Go to Home ('/')
          </span>
        </NuxtLink>

        <!-- Divider -->
        <div class="w-6 h-px bg-white/10 my-0.5"></div>

        <!-- 1. OWNER Workspace: Full Admin Analytics & Business Overview -->
        <NuxtLink
          v-if="authStore.isOwner"
          to="/admin"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin' }"
          title="Owner Analytics Dashboard"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="absolute left-14 bg-neutral-900 text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
            Overview Dashboard
          </span>
        </NuxtLink>

        <!-- 2. OWNER Item Management: Edit & View Catalog Items -->
        <NuxtLink
          v-if="authStore.isOwner"
          to="/admin/items"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin/items' }"
          title="Item Catalog (Edit & View)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </NuxtLink>

        <!-- 3. Categories Management: Create & Edit Taxonomies -->
        <NuxtLink
          v-if="authStore.isOwner || authStore.isAdmin"
          to="/admin/categories"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin/categories' }"
          title="Categories (Create & Manage)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </NuxtLink>

        <!-- 3. OPERATIONS HUB: Create User, Create Item, Stock & History, Accept Orders (OWNER, CASHIER, ADMIN) -->
        <NuxtLink
          to="/admin/operations"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin/operations' }"
          title="Operations Hub (Users, Items, Stock, Orders)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </NuxtLink>

        <!-- 4. CASHIER Workspace: Fast POS Counter & Barcode Terminal -->
        <NuxtLink
          v-if="authStore.canAccessPOS"
          to="/pos"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/pos' }"
          title="POS Counter Terminal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </NuxtLink>

        <!-- 5. ADMIN Workspace: Brand Studio (Hidden completely for OWNER and CASHIER) -->
        <NuxtLink
          v-if="authStore.isAdmin"
          to="/admin/settings"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin/settings' }"
          title="Brand Customization Studio (Admin Only)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </NuxtLink>

        <!-- 6. ADMIN EXCLUSIVE: History Cashier & Owner Activity Audit Trail -->
        <NuxtLink
          v-if="authStore.isAdmin"
          to="/admin/audit"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin/audit' }"
          title="Security & Governance Audit (Admin Only)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </NuxtLink>

        <!-- 7. ADMIN EXCLUSIVE: Database Backup & Import -->
        <NuxtLink
          v-if="authStore.isAdmin"
          to="/admin/backup"
          class="p-2.5 rounded-2xl hover:bg-neutral-800 hover:text-white transition-all relative group"
          :class="{ 'bg-white/10 text-white': route.path === '/admin/backup' }"
          title="Database Backup & Ingest (Admin Only)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </NuxtLink>
      </nav>
    </div>

    <!-- Bottom Actions: Role Badge Avatar & Switch/Logout -->
    <div class="flex flex-col items-center gap-4 mt-auto pt-4 border-t border-white/10 w-full">
      <NuxtLink
        to="/admin/profile"
        class="relative group"
        :title="`View Profile (${authStore.currentRole || 'User'})`"
      >
        <img
          :src="authStore.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'"
          :alt="authStore.currentRole || 'User'"
          class="w-9 h-9 rounded-full object-cover border-2 hover:scale-105 transition-transform"
          :class="{
            'border-amber-400': authStore.isOwner,
            'border-purple-400': authStore.isAdmin,
            'border-emerald-400': authStore.isCashier,
            'border-blue-400': authStore.isCustomer,
            'border-neutral-700': !authStore.user,
          }"
        />
        <span
          class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#141414]"
          :class="{
            'bg-amber-400': authStore.isOwner,
            'bg-purple-400': authStore.isAdmin,
            'bg-emerald-400': authStore.isCashier,
            'bg-blue-400': authStore.isCustomer,
            'bg-neutral-600': !authStore.user,
          }"
        ></span>

        <!-- Tooltip -->
        <span class="absolute left-14 bg-neutral-900 text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
          View Profile ({{ authStore.currentRole }})
        </span>
      </NuxtLink>

      <button
        @click="handleLogout"
        class="p-2 text-neutral-500 hover:text-white transition-colors"
        title="Sign Out"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useThemeStore } from '~/stores/theme';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const logoLoadFailed = ref(false);
watch(() => themeStore.logoUrl, () => {
  logoLoadFailed.value = false;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
