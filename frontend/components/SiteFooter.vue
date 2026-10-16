<template>
  <footer class="bg-[#141414] text-neutral-300 rounded-3xl mx-4 my-6 sm:mx-8 px-8 sm:px-16 py-14">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
      <!-- Col 1: Brand Info -->
      <div class="md:col-span-5 space-y-4">
        <div class="flex items-center gap-2.5">
          <img
            v-if="themeStore.logoUrl && !logoLoadFailed"
            :src="themeStore.logoUrl"
            :alt="themeStore.storeName || 'biolabs'"
            @error="logoLoadFailed = true"
            class="h-8 w-auto max-w-[130px] object-contain rounded-xl bg-white/10 p-1"
          />
          <div
            v-else
            class="w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm"
          >
            {{ (themeStore.storeName || 'b').charAt(0).toLowerCase() }}
          </div>
          <span class="text-white text-xl font-bold tracking-tight">{{ themeStore.storeName || 'biolabs' }}</span>
        </div>
        <p class="text-sm text-neutral-400 max-w-sm leading-relaxed">
          Precision compounds, apparel, and accessories backed by seamless real-time retail synchronization and modern editorial aesthetics.
        </p>
        <div class="flex items-center gap-4 pt-2 text-neutral-400">
          <span class="hover:text-white cursor-pointer transition-colors text-xs font-mono uppercase tracking-wider">Twitter / X</span>
          <span class="hover:text-white cursor-pointer transition-colors text-xs font-mono uppercase tracking-wider">LinkedIn</span>
          <span class="hover:text-white cursor-pointer transition-colors text-xs font-mono uppercase tracking-wider">Instagram</span>
        </div>
      </div>

      <!-- Col 2: Quick Links -->
      <div class="md:col-span-2 space-y-3 text-sm">
        <h4 class="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Explore</h4>
        <ul class="space-y-2">
          <li><NuxtLink to="/shop" class="hover:text-white transition-colors">Catalog Shop</NuxtLink></li>
          <li><NuxtLink to="/location" class="hover:text-white transition-colors">Retail Locations</NuxtLink></li>
          <li><NuxtLink to="/about" class="hover:text-white transition-colors">About Mission</NuxtLink></li>
          <li><NuxtLink to="/pos" class="hover:text-white transition-colors">Cashier Terminal</NuxtLink></li>
          <li><NuxtLink to="/admin" class="hover:text-white transition-colors">Admin Studio</NuxtLink></li>
          <li><NuxtLink to="/login" class="hover:text-white transition-colors">Client Portal</NuxtLink></li>
        </ul>
      </div>

      <!-- Col 3: Legal & Trust -->
      <div class="md:col-span-2 space-y-3 text-sm">
        <h4 class="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Standards</h4>
        <ul class="space-y-2 text-neutral-400">
          <li>COA Verification</li>
          <li>Purity Standards</li>
          <li>Cold-Chain Shipping</li>
          <li>Terms of Research</li>
        </ul>
      </div>

      <!-- Col 4: Newsletter -->
      <div class="md:col-span-3 space-y-3">
        <h4 class="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Updates</h4>
        <p class="text-xs text-neutral-400">Receive batch release notes and seasonal additions.</p>
        <div class="flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-1.5 focus-within:border-neutral-600">
          <input
            type="email"
            placeholder="Your work email..."
            class="bg-transparent px-3 text-xs text-white focus:outline-none w-full"
          />
          <button
            class="bg-white text-black text-xs font-medium px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
          >
            Join
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pt-10 mt-10 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
      <p>© {{ new Date().getFullYear() }} {{ themeStore.storeName || 'biolabs' }}. All rights reserved.</p>
      <div class="flex items-center gap-6">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
        <span>Security</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useThemeStore } from '~/stores/theme';

const themeStore = useThemeStore();
const logoLoadFailed = ref(false);

watch(() => themeStore.logoUrl, () => {
  logoLoadFailed.value = false;
});
</script>
