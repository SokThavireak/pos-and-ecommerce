<template>
  <div class="flex-1 flex flex-col">
    <SiteHeader />

    <!-- Minimalist Subheader Banner -->
    <section class="w-full bg-[#f4f5f7] border-b border-black/5 py-10">
      <div class="max-w-7xl mx-auto px-6 text-center space-y-2">
        <h1 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900">Retail & Lab Locations</h1>
        <div class="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
          <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">Locations</span>
        </div>
      </div>
    </section>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">
      <!-- Intro Hero Banner -->
      <div class="bg-[var(--color-surface)] border border-black/5 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-4 max-w-2xl">
          <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-mono font-semibold">
            SYNCHRONIZED DISPATCH & POS COUNTERS
          </span>
          <h2 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900 leading-tight">
            Visit our physical research counters and retail experience hubs.
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed font-light">
            Every location features integrated POS terminals with real-time stock sync, certified cold-chain pickup lockers, and onsite compound purity verifications.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            to="/pos"
            class="px-6 py-3 rounded-full bg-neutral-950 text-white font-medium text-xs hover:bg-[var(--color-primary)] transition-all shadow-sm"
          >
            Launch Cashier POS
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="px-6 py-3 rounded-full bg-white text-neutral-800 font-medium text-xs border border-neutral-300 hover:border-black transition-all"
          >
            Shop Online First
          </NuxtLink>
        </div>
      </div>

      <!-- Location Filter / Search -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-black/5">
        <div class="flex items-center gap-2">
          <button
            @click="selectedRegion = null"
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="!selectedRegion ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
          >
            All Hubs ({{ locations.length }})
          </button>
          <button
            v-for="region in ['North America', 'Europe', 'Asia Pacific']"
            :key="region"
            @click="selectedRegion = region"
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            :class="selectedRegion === region ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
          >
            {{ region }}
          </button>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search city, state or hub..."
            class="w-full bg-neutral-100 text-xs px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      <!-- Locations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="loc in filteredLocations"
          :key="loc.id"
          class="bg-white border border-black/5 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 space-y-6 group"
        >
          <!-- Top Location Image -->
          <div class="relative aspect-[16/10] bg-neutral-100 rounded-2xl overflow-hidden">
            <img
              :src="loc.image"
              :alt="loc.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span class="absolute top-3 right-3 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-neutral-800 shadow-xs">
              {{ loc.badge }}
            </span>
          </div>

          <!-- Info -->
          <div class="space-y-3">
            <div>
              <span class="text-[11px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">
                {{ loc.region }}
              </span>
              <h3 class="font-serif text-xl font-medium text-neutral-900 mt-0.5">{{ loc.name }}</h3>
              <p class="text-xs text-neutral-500 font-mono mt-1">{{ loc.address }}</p>
            </div>

            <div class="space-y-1.5 text-xs text-neutral-600 font-light border-t border-black/5 pt-3">
              <div class="flex items-center justify-between">
                <span class="text-neutral-400 font-mono text-[11px]">Hours:</span>
                <span class="font-medium text-neutral-800">{{ loc.hours }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-400 font-mono text-[11px]">Contact:</span>
                <span class="font-medium text-neutral-800">{{ loc.phone }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-400 font-mono text-[11px]">Cold-Storage:</span>
                <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                  Active -20°C
                </span>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="pt-2 flex items-center gap-2">
            <a
              :href="loc.mapUrl"
              target="_blank"
              class="flex-1 py-2.5 rounded-full text-center text-xs font-medium border border-neutral-200 text-neutral-800 hover:border-black transition-colors"
            >
              Get Directions
            </a>
            <NuxtLink
              to="/shop"
              class="flex-1 py-2.5 rounded-full text-center text-xs font-medium bg-neutral-900 text-white hover:bg-[var(--color-primary)] transition-colors"
            >
              Reserve Stock
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- FAQ & Pickup Guideline Banner -->
      <section class="bg-white border border-black/5 rounded-3xl p-8 sm:p-10 space-y-6">
        <div class="space-y-1">
          <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-mono font-semibold">
            CLICK & COLLECT GUIDELINES
          </span>
          <h3 class="font-serif text-2xl font-medium text-neutral-900">
            How in-store pickup works with our unified POS.
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div class="space-y-2 p-4 bg-neutral-50 rounded-2xl">
            <div class="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs font-mono">
              01
            </div>
            <h4 class="font-medium text-sm text-neutral-900">Order Online or Reserve</h4>
            <p class="text-xs text-neutral-600 leading-relaxed font-light">
              Choose your items from the shop catalog and select your preferred pickup location at checkout.
            </p>
          </div>

          <div class="space-y-2 p-4 bg-neutral-50 rounded-2xl">
            <div class="w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs font-mono">
              02
            </div>
            <h4 class="font-medium text-sm text-neutral-900">Automated POS Sync</h4>
            <p class="text-xs text-neutral-600 leading-relaxed font-light">
              Your ticket routes directly to the local counter's POS screen. Cashiers prepare cold-storage packaging immediately.
            </p>
          </div>

          <div class="space-y-2 p-4 bg-neutral-50 rounded-2xl">
            <div class="w-8 h-8 rounded-xl bg-[var(--color-secondary)] text-white flex items-center justify-center font-bold text-xs font-mono">
              03
            </div>
            <h4 class="font-medium text-sm text-neutral-900">Contactless QR Pickup</h4>
            <p class="text-xs text-neutral-600 leading-relaxed font-light">
              Scan your mobile ticket at the counter for instant barcode verification and seamless physical handover.
            </p>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const selectedRegion = ref<string | null>(null);
const searchQuery = ref('');

const locations = [
  {
    id: 'loc-01',
    name: 'Boston Biomedical Hub & Retail',
    region: 'North America',
    address: '450 Kendall Street, Cambridge, MA 02142',
    hours: 'Mon – Sat: 8:00 AM – 7:00 PM',
    phone: '+1 (617) 555-0192',
    badge: 'Flagship Lab',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 'loc-02',
    name: 'San Francisco Mission Bay Counter',
    region: 'North America',
    address: '1600 Owens Street, San Francisco, CA 94158',
    hours: 'Mon – Fri: 9:00 AM – 6:00 PM',
    phone: '+1 (415) 555-0143',
    badge: 'Express POS Pickup',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 'loc-03',
    name: 'London King’s Cross Innovation Center',
    region: 'Europe',
    address: '1 Pancras Square, London N1C 4AG, UK',
    hours: 'Mon – Sat: 9:00 AM – 8:00 PM',
    phone: '+44 20 7946 0912',
    badge: 'European Depot',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 'loc-04',
    name: 'Zurich Biocenter Hub',
    region: 'Europe',
    address: 'Technoparkstrasse 1, 8005 Zürich, Switzerland',
    hours: 'Mon – Fri: 8:30 AM – 5:30 PM',
    phone: '+41 44 632 11 11',
    badge: 'Cold Storage Vault',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 'loc-05',
    name: 'Singapore One-North Biopolis',
    region: 'Asia Pacific',
    address: '30 Biopolis Way, Matrix Building, Singapore 138671',
    hours: 'Mon – Sat: 9:00 AM – 6:30 PM',
    phone: '+65 6778 0000',
    badge: 'Asia Dispatch Center',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 'loc-06',
    name: 'Tokyo Nihonbashi Life Science Hub',
    region: 'Asia Pacific',
    address: '2-3-11 Nihonbashihoncho, Chuo City, Tokyo 103-0023',
    hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
    phone: '+81 3 5555 0188',
    badge: 'Retail & Consultation',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
    mapUrl: 'https://maps.google.com',
  },
];

const filteredLocations = computed(() => {
  return locations.filter((loc) => {
    const matchesRegion = !selectedRegion.value || loc.region === selectedRegion.value;
    const matchesSearch =
      !searchQuery.value ||
      loc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loc.region.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesRegion && matchesSearch;
  });
});
</script>
