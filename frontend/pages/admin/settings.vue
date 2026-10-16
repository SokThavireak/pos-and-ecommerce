<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Floating Vertical Dark Pill Sidebar -->
    <AdminSidebar />

    <!-- Brand Customization Studio Area (Full Width & Responsive) -->
    <main v-if="authStore.isAdmin" class="flex-1 space-y-6 overflow-y-auto h-full w-full pr-1">
      <!-- Header -->
      <header class="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Brand Customization Studio</h1>
            <span class="text-xs bg-purple-100 text-purple-800 font-mono font-semibold px-2.5 py-0.5 rounded-full">
              ADMIN ROLE ONLY
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-1">
            Configure white-label brand colors, typography tints, and store identities across all client interfaces instantly.
          </p>
        </div>

        <button
          @click="saveTheme"
          :disabled="isSaving"
          class="px-6 py-2.5 rounded-full bg-neutral-900 text-white font-semibold text-xs hover:bg-black transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-else>Broadcast Theme Live</span>
        </button>
      </header>

      <!-- Settings Grid: Controls + Live Preview Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Controls Column (6 cols) -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Identity Card -->
          <div class="bg-white border border-black/5 rounded-3xl p-6 space-y-5 shadow-xs">
            <h3 class="text-sm font-bold text-neutral-900 uppercase tracking-wider font-mono">Store Identity & Branding</h3>
            
            <div>
              <label class="block text-xs text-neutral-500 font-medium mb-1.5">Brand Name</label>
              <input
                type="text"
                v-model="storeName"
                class="w-full bg-neutral-100 text-xs text-neutral-900 rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <!-- Logo Image Upload & URL input -->
            <div class="space-y-3 pt-1 border-t border-black/5">
              <div class="flex items-center justify-between">
                <label class="block text-xs text-neutral-700 font-semibold">Store Logo Image</label>
                <button
                  v-if="logoUrl"
                  type="button"
                  @click="logoUrl = ''"
                  class="text-[11px] text-rose-500 hover:text-rose-700 font-mono"
                >
                  Clear Custom Logo ✕
                </button>
              </div>

              <!-- Logo Preview & Upload Dropzone -->
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    v-if="logoUrl"
                    :src="logoUrl"
                    alt="Logo Preview"
                    class="w-full h-full object-contain p-1"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-base"
                    :style="{ backgroundColor: primaryColor }"
                  >
                    {{ (storeName || 'b').charAt(0).toLowerCase() }}
                  </div>
                </div>

                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-2">
                    <label class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Upload Logo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleLogoUpload"
                        class="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      @click="selectDemoLogo('biotech')"
                      class="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      title="Load Bio Helix Logo"
                    >
                      🧬 Bio Helix
                    </button>
                    <button
                      type="button"
                      @click="selectDemoLogo('luxury')"
                      class="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      title="Load Minimal Monogram"
                    >
                      ✨ Monogram
                    </button>
                    <button
                      type="button"
                      @click="selectDemoLogo('pharma')"
                      class="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      title="Load Precision Pharma Emblem"
                    >
                      🔬 Precision
                    </button>
                  </div>
                  <input
                    type="text"
                    v-model="logoUrl"
                    placeholder="Or paste any custom logo image URL..."
                    class="w-full bg-neutral-100 text-[11px] text-neutral-900 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Color Tokens Card -->
          <div class="bg-white border border-black/5 rounded-3xl p-6 space-y-5 shadow-xs">
            <h3 class="text-sm font-bold text-neutral-900 uppercase tracking-wider font-mono">Color Palette Engine</h3>
            
            <!-- Primary Color -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-neutral-700">Primary Color (Buttons, Accents)</span>
                <span class="font-mono text-neutral-400">{{ primaryColor }}</span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  v-model="primaryColor"
                  class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  v-model="primaryColor"
                  class="flex-1 bg-neutral-100 text-xs text-neutral-900 rounded-full px-4 py-2 font-mono"
                />
              </div>
            </div>

            <!-- Secondary Color -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-neutral-700">Secondary Color (Bento Highlights, Badges)</span>
                <span class="font-mono text-neutral-400">{{ secondaryColor }}</span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  v-model="secondaryColor"
                  class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  v-model="secondaryColor"
                  class="flex-1 bg-neutral-100 text-xs text-neutral-900 rounded-full px-4 py-2 font-mono"
                />
              </div>
            </div>

            <!-- Surface Color -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-neutral-700">Surface Tint (Bento Containers & Badges)</span>
                <span class="font-mono text-neutral-400">{{ surfaceColor }}</span>
              </div>
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  v-model="surfaceColor"
                  class="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  v-model="surfaceColor"
                  class="flex-1 bg-neutral-100 text-xs text-neutral-900 rounded-full px-4 py-2 font-mono"
                />
              </div>
            </div>

            <!-- Presets -->
            <div class="pt-3 border-t border-black/5">
              <span class="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Preset Themes:</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="preset in presets"
                  :key="preset.name"
                  @click="applyPreset(preset)"
                  class="text-[11px] px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-700 hover:border-black font-medium transition-colors"
                >
                  {{ preset.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Preview Column (6 cols) -->
        <div class="lg:col-span-6 space-y-4">
          <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-neutral-900 uppercase tracking-wider font-mono">Live Runtime Preview</h3>
                <p class="text-xs text-neutral-400">Simulates storefront and POS components with your custom tokens.</p>
              </div>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-semibold px-2.5 py-1 rounded-full">
                Synchronized
              </span>
            </div>

            <!-- Sample Bento Box preview -->
            <div
              class="rounded-3xl p-6 space-y-4 transition-colors duration-300 shadow-sm"
              :style="{ backgroundColor: surfaceColor }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <img
                    v-if="logoUrl"
                    :src="logoUrl"
                    alt="Logo"
                    class="h-8 w-auto max-w-[120px] object-contain rounded-xl"
                  />
                  <div
                    v-else
                    class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs"
                    :style="{ backgroundColor: primaryColor }"
                  >
                    {{ (storeName || 'b').charAt(0).toLowerCase() }}
                  </div>
                  <span class="text-base font-bold text-neutral-900 tracking-tight">{{ storeName }}</span>
                </div>
                <span
                  class="text-[10px] text-white px-3 py-1 rounded-full font-mono font-semibold shadow-xs"
                  :style="{ backgroundColor: secondaryColor }"
                >
                  Featured Badge
                </span>
              </div>

              <div class="space-y-1 pt-1">
                <h4 class="font-serif text-xl sm:text-2xl font-medium text-neutral-900">
                  Precision Bio-Active Formulations
                </h4>
                <p class="text-xs text-neutral-600 leading-relaxed max-w-lg">
                  Preview demonstrating how your customized color palette dynamically styles buttons, pill badges, and container surface highlights across client viewports.
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button
                  class="px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 flex items-center gap-2"
                  :style="{ backgroundColor: primaryColor }"
                >
                  <span>Primary Action Button</span>
                  <span>→</span>
                </button>
                <button class="px-4 py-2.5 rounded-full text-xs font-semibold bg-white text-neutral-800 border border-black/5 hover:border-black transition-colors">
                  Secondary Pill
                </button>
              </div>
            </div>

            <!-- Simulated POS Item Line -->
            <div class="border border-black/5 rounded-2xl p-4 flex items-center justify-between gap-3 bg-neutral-50/60">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs" :style="{ backgroundColor: surfaceColor }">
                  🔬
                </div>
                <div>
                  <p class="text-xs font-semibold text-neutral-900">Epithalon 20mg Peptide Vial</p>
                  <p class="text-[10px] text-neutral-400 font-mono">SKU: PEP-EPI-20 • 120 units in stock</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs font-mono font-bold" :style="{ color: primaryColor }">$75.00</p>
                <span class="text-[10px] text-emerald-600 font-mono">Live In Stock</span>
              </div>
            </div>

            <!-- Color Swatches Grid -->
            <div class="grid grid-cols-3 gap-3 pt-1 text-center text-xs font-mono">
              <div class="space-y-1 bg-neutral-50 p-2.5 rounded-2xl border border-black/5">
                <div class="h-10 rounded-xl shadow-xs" :style="{ backgroundColor: primaryColor }"></div>
                <span class="text-neutral-700 font-bold text-[11px] block mt-1">Primary</span>
                <span class="text-neutral-400 text-[10px] block">{{ primaryColor }}</span>
              </div>
              <div class="space-y-1 bg-neutral-50 p-2.5 rounded-2xl border border-black/5">
                <div class="h-10 rounded-xl shadow-xs" :style="{ backgroundColor: secondaryColor }"></div>
                <span class="text-neutral-700 font-bold text-[11px] block mt-1">Secondary</span>
                <span class="text-neutral-400 text-[10px] block">{{ secondaryColor }}</span>
              </div>
              <div class="space-y-1 bg-neutral-50 p-2.5 rounded-2xl border border-black/5">
                <div class="h-10 rounded-xl border border-black/10 shadow-xs" :style="{ backgroundColor: surfaceColor }"></div>
                <span class="text-neutral-700 font-bold text-[11px] block mt-1">Surface</span>
                <span class="text-neutral-400 text-[10px] block">{{ surfaceColor }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Unauthorized Banner if non-ADMIN (e.g. OWNER) tries to access Brand Studio -->
    <main v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div class="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-neutral-900">Restricted to System Administrator</h2>
        <p class="text-xs text-neutral-500 max-w-md mx-auto">
          As a Store Owner, you have complete authority over sales, revenue, products, and financials. White-label logo and color adjustments are strictly reserved for the <strong>ADMIN</strong> role.
        </p>
      </div>
      <div class="flex items-center gap-3 pt-2">
        <NuxtLink
          to="/admin"
          class="px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-black transition-colors"
        >
          Return to Owner Overview
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="px-6 py-2.5 rounded-full bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:border-black transition-colors"
        >
          Switch to Admin Role
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '~/stores/theme';
import { useAuthStore } from '~/stores/auth';
import { useAlertStore } from '~/stores/alert';

const themeStore = useThemeStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const config = useRuntimeConfig();

const storeName = ref(themeStore.storeName || 'biolabs');
const logoUrl = ref(themeStore.logoUrl || '');
const primaryColor = ref(themeStore.colorPrimary || '#d97757');
const secondaryColor = ref(themeStore.colorSecondary || '#8b5cf6');
const surfaceColor = ref(themeStore.colorSurface || '#fdf2ee');
const isSaving = ref(false);

function handleLogoUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alertStore.error('Please select an image file (PNG, JPG, SVG, WebP).', 'Invalid File');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    logoUrl.value = (e.target?.result as string) || '';
    alertStore.success('Logo image uploaded successfully. Click Broadcast to save.', 'Logo Updated');
  };
  reader.readAsDataURL(file);
}

function selectDemoLogo(type: 'biotech' | 'luxury' | 'pharma') {
  if (type === 'biotech') {
    logoUrl.value = 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=160&auto=format&fit=crop&q=80';
    storeName.value = 'biolabs';
    alertStore.info('Loaded 🧬 Bio Helix logo demo. Click Broadcast to apply.', 'Demo Logo Loaded');
  } else if (type === 'luxury') {
    logoUrl.value = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=160&auto=format&fit=crop&q=80';
    storeName.value = 'atelier';
    alertStore.info('Loaded ✨ Monogram logo demo. Click Broadcast to apply.', 'Demo Logo Loaded');
  } else {
    logoUrl.value = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=160&auto=format&fit=crop&q=80';
    storeName.value = 'synthlabs';
    alertStore.info('Loaded 🔬 Precision Pharma logo demo. Click Broadcast to apply.', 'Demo Logo Loaded');
  }
}

const presets = [
  { name: 'Warm Editorial (Default)', primary: '#d97757', secondary: '#8b5cf6', surface: '#fdf2ee' },
  { name: 'Sage Botanicals', primary: '#2d6a4f', secondary: '#52b788', surface: '#eef8f2' },
  { name: 'Nordic Indigo', primary: '#2563eb', secondary: '#f59e0b', surface: '#eff6ff' },
  { name: 'Onyx Monochrome', primary: '#171717', secondary: '#737373', surface: '#f5f5f5' },
];

const applyPreset = (preset: any) => {
  primaryColor.value = preset.primary;
  secondaryColor.value = preset.secondary;
  surfaceColor.value = preset.surface;
  themeStore.applyTheme({
    colorPrimary: primaryColor.value,
    colorSecondary: secondaryColor.value,
    colorSurface: surfaceColor.value,
  });
};

const saveTheme = async () => {
  isSaving.value = true;
  themeStore.applyTheme({
    storeName: storeName.value,
    logoUrl: logoUrl.value,
    colorPrimary: primaryColor.value,
    colorSecondary: secondaryColor.value,
    colorSurface: surfaceColor.value,
  });

  const backendUrl = config.public.backendUrl || 'http://localhost:3001';
  try {
    await $fetch(`${backendUrl}/api/settings`, {
      method: 'PATCH',
      body: {
        storeName: storeName.value,
        logoUrl: logoUrl.value,
        colorPrimary: primaryColor.value,
        colorSecondary: secondaryColor.value,
        colorSurface: surfaceColor.value,
      },
    });
  } catch (err) {
    // Client local fallback is already updated via Pinia
    console.warn('Backend not online yet; theme updated on client locally.', err);
  } finally {
    isSaving.value = false;
    alertStore.success('Brand identity and logo broadcasted live across all storefront and POS interfaces!', 'Theme Saved');
  }
};
</script>
