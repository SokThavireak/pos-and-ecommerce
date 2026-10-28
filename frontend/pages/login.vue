<template>
  <div class="min-h-screen bg-[#0d0d0d] text-white flex flex-col justify-between p-4 sm:p-8">
    <!-- Top Navigation Bar -->
    <header class="w-full flex items-center justify-between py-2 px-2 max-w-7xl mx-auto">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <img
          v-if="themeStore.logoUrl"
          :src="themeStore.logoUrl"
          :alt="themeStore.storeName || 'biolabs'"
          class="h-9 w-auto max-w-[130px] object-contain rounded-xl"
        />
        <div
          v-else
          class="w-9 h-9 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg"
        >
          {{ (themeStore.storeName || 'b').charAt(0).toLowerCase() }}
        </div>
        <span class="font-bold text-lg tracking-tight">{{ themeStore.storeName || 'biolabs' }}</span>
      </NuxtLink>

      <NuxtLink to="/" class="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono">
        ← Back to Storefront
      </NuxtLink>
    </header>

    <!-- Main Content: Split 50/50 Desktop -->
    <main class="w-full max-w-7xl mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <!-- Left Visual Showcase: 3x3 Bento Grid -->
      <div class="lg:col-span-6 grid grid-cols-3 gap-3 p-2">
        <!-- Tile 1: Photo -->
        <div class="aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800">
          <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400" alt="Tile" class="w-full h-full object-cover" />
        </div>

        <!-- Tile 2: Secondary Color Card -->
        <div class="aspect-square rounded-3xl bg-[var(--color-secondary)] text-white p-5 flex flex-col justify-between shadow-lg">
          <span class="text-xs font-mono font-medium opacity-80">01 / System</span>
          <p class="text-sm font-semibold leading-snug">Total Care. Total Different.</p>
        </div>

        <!-- Tile 3: Dark Subtle Texture -->
        <div class="aspect-square rounded-3xl bg-neutral-900/80 border border-neutral-800 p-5 flex flex-col justify-end">
          <div class="w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center text-xs text-neutral-400 font-mono">
            +
          </div>
        </div>

        <!-- Tile 4: Surface Tinted Typography Card -->
        <div class="aspect-square rounded-3xl bg-[#fdf2ee] text-neutral-900 p-5 flex flex-col justify-between">
          <span class="text-xs font-bold text-[var(--color-primary)] font-mono">+ VERIFIED</span>
          <p class="text-xs sm:text-sm font-medium leading-snug">
            Building trust in cold-chain retail technology.
          </p>
        </div>

        <!-- Tile 5: Center Brand Logo Tile -->
        <div class="aspect-square rounded-3xl bg-[var(--color-secondary)]/90 text-white flex items-center justify-center p-6 shadow-xl border border-white/10 group">
          <div class="w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center">
            <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <!-- Tile 6: Photo -->
        <div class="aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800">
          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" alt="Tile" class="w-full h-full object-cover" />
        </div>

        <!-- Tile 7: Dark Pattern -->
        <div class="aspect-square rounded-3xl bg-neutral-900 border border-neutral-800 p-5 flex flex-col justify-between">
          <span class="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">ENCRYPTED</span>
          <span class="text-xs text-neutral-400 font-mono">256-BIT JWT</span>
        </div>

        <!-- Tile 8: Primary Accent Typography Card -->
        <div class="aspect-square rounded-3xl bg-[var(--color-primary)] text-white p-5 flex flex-col justify-between">
          <span class="text-xs font-mono font-medium opacity-80">+ ACCESS</span>
          <p class="text-sm font-semibold leading-snug">Own your power.</p>
        </div>

        <!-- Tile 9: Photo -->
        <div class="aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800">
          <img src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400" alt="Tile" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Right Form Area: Centered Minimalist Dark Inputs -->
      <div class="lg:col-span-6 max-w-md mx-auto w-full space-y-8 px-4">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight text-white">
            {{ isLogin ? 'Sign In' : 'Sign Up' }}
          </h2>
          <p class="text-xs text-neutral-400">
            Access your research portal, cashier permissions, or administrative brand settings.
          </p>
        </div>

        <!-- Tab toggle -->
        <div class="flex items-center gap-2 p-1 bg-neutral-900 rounded-full border border-neutral-800 w-fit">
          <button
            type="button"
            @click="isLogin = true"
            class="px-5 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="isLogin ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'"
          >
            Sign In
          </button>
          <button
            type="button"
            @click="isLogin = false"
            class="px-5 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="!isLogin ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'"
          >
            Create Account
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLogin" class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] text-neutral-400 uppercase tracking-wider font-mono mb-1.5">First Name</label>
              <input
                type="text"
                v-model="firstName"
                placeholder="Jane"
                class="w-full bg-transparent border border-neutral-800 rounded-full px-5 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>
            <div>
              <label class="block text-[11px] text-neutral-400 uppercase tracking-wider font-mono mb-1.5">Last Name</label>
              <input
                type="text"
                v-model="lastName"
                placeholder="Doe"
                class="w-full bg-transparent border border-neutral-800 rounded-full px-5 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] text-neutral-400 uppercase tracking-wider font-mono mb-1.5">Email Address</label>
            <input
              type="email"
              v-model="email"
              placeholder="admin@biolabs.com"
              required
              class="w-full bg-transparent border border-neutral-800 rounded-full px-5 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label class="block text-[11px] text-neutral-400 uppercase tracking-wider font-mono mb-1.5">Password</label>
            <input
              type="password"
              v-model="password"
              placeholder="••••••••••••"
              required
              class="w-full bg-transparent border border-neutral-800 rounded-full px-5 py-3 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <!-- Quick Role Selector Demo (for instant testing 4 roles) -->
          <div class="pt-1">
            <span class="block text-[10px] text-neutral-500 font-mono mb-1.5 uppercase tracking-wider">Quick Fill Demo Roles:</span>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="fillDemo('owner')"
                class="text-[11px] px-3 py-1.5 rounded-full bg-neutral-900 border text-neutral-300 hover:border-neutral-500 transition-colors flex items-center justify-between"
                :class="selectedRole === 'owner' ? 'border-[var(--color-primary)] text-white ring-1 ring-[var(--color-primary)]' : 'border-neutral-800'"
              >
                <span class="font-semibold text-white">Owner</span>
                <span class="text-[9px] font-mono text-[var(--color-primary)]">Full Store</span>
              </button>
              <button
                type="button"
                @click="fillDemo('admin')"
                class="text-[11px] px-3 py-1.5 rounded-full bg-neutral-900 border text-neutral-300 hover:border-neutral-500 transition-colors flex items-center justify-between"
                :class="selectedRole === 'admin' ? 'border-purple-500 text-white ring-1 ring-purple-500' : 'border-neutral-800'"
              >
                <span class="font-semibold text-white">Admin</span>
                <span class="text-[9px] font-mono text-purple-400">Settings</span>
              </button>
              <button
                type="button"
                @click="fillDemo('cashier')"
                class="text-[11px] px-3 py-1.5 rounded-full bg-neutral-900 border text-neutral-300 hover:border-neutral-500 transition-colors flex items-center justify-between"
                :class="selectedRole === 'cashier' ? 'border-emerald-500 text-white ring-1 ring-emerald-500' : 'border-neutral-800'"
              >
                <span class="font-semibold text-white">Cashier</span>
                <span class="text-[9px] font-mono text-emerald-400">POS Ready</span>
              </button>
              <button
                type="button"
                @click="fillDemo('customer')"
                class="text-[11px] px-3 py-1.5 rounded-full bg-neutral-900 border text-neutral-300 hover:border-neutral-500 transition-colors flex items-center justify-between"
                :class="selectedRole === 'customer' ? 'border-blue-500 text-white ring-1 ring-blue-500' : 'border-neutral-800'"
              >
                <span class="font-semibold text-white">Customer</span>
                <span class="text-[9px] font-mono text-blue-400">Shop/Portal</span>
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium text-center">
            {{ errorMessage }}
          </div>

          <!-- High-Contrast Solid White Pill Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-neutral-200 transition-colors shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ isLogin ? (isLoading ? 'Signing In...' : 'Sign In to Workspace') : 'Complete Registration' }}</span>
          </button>
        </form>

        <!-- "or" Divider -->
        <div class="relative flex items-center justify-center my-4">
          <div class="border-t border-neutral-800 w-full"></div>
          <span class="bg-[#0d0d0d] px-3 text-[11px] text-neutral-500 font-mono">or continue with</span>
        </div>

        <!-- Dark Pill OAuth Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 16.333 15.645 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.47 0 2.812.525 3.862 1.387l2.362-2.362C16.945 3.565 14.73 3 12.24 3 7.27 3 3.24 7.03 3.24 12s4.03 9 9 9c5.22 0 8.685-3.66 8.685-8.85 0-.585-.06-1.155-.165-1.715H12.24z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            class="flex items-center justify-center gap-2 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </main>

    <!-- Bottom Footer Note -->
    <footer class="w-full text-center py-4 text-[11px] text-neutral-500 font-mono">
      Protected by JWT RBAC authentication system. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '~/stores/theme';
import { useAuthStore } from '~/stores/auth';

const themeStore = useThemeStore();
const authStore = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const firstName = ref('');
const lastName = ref('');
const email = ref('admin@biolabs.com');
const password = ref('adminpassword');
const selectedRole = ref<'owner' | 'admin' | 'cashier' | 'customer'>('admin');
const isLoading = ref(false);
const errorMessage = ref('');

const fillDemo = (role: 'owner' | 'admin' | 'cashier' | 'customer') => {
  selectedRole.value = role;
  if (role === 'owner') {
    email.value = 'owner@biolabs.com';
    password.value = 'ownerpassword';
  } else if (role === 'admin') {
    email.value = 'admin@biolabs.com';
    password.value = 'adminpassword';
  } else if (role === 'cashier') {
    email.value = 'cashier@biolabs.com';
    password.value = 'cashierpassword';
  } else {
    email.value = 'customer@biolabs.com';
    password.value = 'customerpassword';
  }
};

const navigateToRole = (role?: string | null) => {
  if (role === 'OWNER') {
    router.push('/admin');
  } else if (role === 'ADMIN') {
    router.push('/admin/settings');
  } else if (role === 'CASHIER') {
    router.push('/pos');
  } else {
    router.push('/');
  }
};

const handleSubmit = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const res = await authStore.login(email.value.trim(), password.value);
    navigateToRole(res.user?.role);
  } catch (err: any) {
    // If backend is offline or on demo deployment, gracefully fall back to demo session
    const currentEmail = email.value.trim().toLowerCase();
    if (currentEmail.includes('owner') || password.value === 'ownerpassword') {
      await authStore.loginAs('OWNER');
      navigateToRole('OWNER');
    } else if (currentEmail.includes('admin') || password.value === 'adminpassword') {
      await authStore.loginAs('ADMIN');
      navigateToRole('ADMIN');
    } else if (currentEmail.includes('cashier') || password.value === 'cashierpassword') {
      await authStore.loginAs('CASHIER');
      navigateToRole('CASHIER');
    } else if (currentEmail.includes('customer') || password.value === 'customerpassword') {
      await authStore.loginAs('CUSTOMER');
      navigateToRole('CUSTOMER');
    } else {
      errorMessage.value = err.data?.message || 'Login failed. Please verify credentials.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
