<template>
  <div class="flex-1 flex flex-col">
    <SiteHeader />

    <!-- Minimalist Subheader Banner -->
    <section class="w-full bg-[#f4f5f7] border-b border-black/5 py-10">
      <div class="max-w-7xl mx-auto px-6 text-center space-y-2">
        <h1 class="font-serif text-3xl sm:text-4xl font-medium text-neutral-900">About Our Mission</h1>
        <div class="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
          <NuxtLink to="/" class="hover:text-black">Home</NuxtLink>
          <span>/</span>
          <span class="text-neutral-900 font-semibold">About Us</span>
        </div>
      </div>
    </section>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-16">
      <!-- 1. Hero Split Story Banner -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-7 space-y-6">
          <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-mono font-semibold">
            THE ARCHITECTURE OF PRECISION
          </span>
          <h2 class="font-serif text-4xl sm:text-5xl font-medium text-neutral-900 leading-[1.15]">
            Bridging clinical molecular purity with modern omnichannel commerce.
          </h2>
          <p class="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
            Founded with the conviction that advanced research compounds and curated daily essentials demand the same standard of rigorous transparency: third-party HPLC analytical validation, cold-chain integrity, and zero latency between digital checkout and physical retail dispensing.
          </p>
          <div class="grid grid-cols-3 gap-6 pt-4 border-t border-black/5">
            <div>
              <p class="text-3xl font-bold font-serif text-neutral-900">≥ 99.4%</p>
              <p class="text-[11px] text-neutral-500 font-mono mt-1">Certified Batch Purity</p>
            </div>
            <div>
              <p class="text-3xl font-bold font-serif text-neutral-900">14</p>
              <p class="text-[11px] text-neutral-500 font-mono mt-1">Global Retail Hubs</p>
            </div>
            <div>
              <p class="text-3xl font-bold font-serif text-neutral-900">0.02s</p>
              <p class="text-[11px] text-neutral-500 font-mono mt-1">Real-Time POS Sync</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-[var(--color-surface)] rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"
            alt="Laboratory Precision"
            class="rounded-2xl w-full h-[380px] object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute bottom-10 left-10 right-10 bg-black/70 backdrop-blur-md text-white p-4 rounded-2xl text-xs space-y-1">
            <p class="font-mono text-neutral-300 uppercase tracking-widest text-[10px]">Cambridge Biosafety Cleanroom</p>
            <p class="font-medium">Direct automated cold dispensing & real-time inventory ledger.</p>
          </div>
        </div>
      </section>

      <!-- 2. Bento Grid: Core Values & Pillars -->
      <section class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-mono font-semibold">
            OUR CORE PILLARS
          </span>
          <h3 class="font-serif text-3xl font-medium text-neutral-900">Designed with intent at every touchpoint.</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Pillar 1 -->
          <div class="bg-white border border-black/5 rounded-3xl p-8 space-y-4 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)] flex items-center justify-center font-bold">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 class="font-serif text-xl font-medium text-neutral-900">Analytical Transparency</h4>
            <p class="text-xs text-neutral-600 leading-relaxed font-light">
              We never conceal lot data. Every single peptide vial and apparel item includes an indelible QR code that links directly to public certificates of analysis (COA) and material provenance.
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="bg-[#141414] text-white rounded-3xl p-8 space-y-4 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="w-12 h-12 rounded-2xl bg-neutral-800 text-[var(--color-secondary)] flex items-center justify-center font-bold">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 class="font-serif text-xl font-medium text-white">Unified POS & Online Ledger</h4>
            <p class="text-xs text-neutral-400 leading-relaxed font-light">
              Built on WebSockets and code-first database sync. An item checked out at our Cambridge POS counter is deducted from online storefront availability in milliseconds.
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="bg-[var(--color-surface)] border border-black/5 rounded-3xl p-8 space-y-4 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 rounded-2xl bg-white text-neutral-900 flex items-center justify-center font-bold shadow-xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 class="font-serif text-xl font-medium text-neutral-900">Cold-Chain Stewardship</h4>
            <p class="text-xs text-neutral-600 leading-relaxed font-light">
              Temperature-monitored packaging with dry ice and specialized insulated thermal shippers ensure compounds arrive lyophilized and bioactive without denaturation.
            </p>
          </div>
        </div>
      </section>

      <!-- 3. Leadership & Senior Scientific Advisory -->
      <section class="space-y-6">
        <div class="space-y-1">
          <span class="text-xs uppercase tracking-widest text-[var(--color-primary)] font-mono font-semibold">
            LEADERSHIP & ADVISORY
          </span>
          <h3 class="font-serif text-3xl font-medium text-neutral-900">Guided by scientists and system architects.</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="person in team"
            :key="person.name"
            class="bg-white border border-black/5 rounded-3xl p-5 space-y-3 group hover:shadow-md transition-all"
          >
            <div class="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
              <img
                :src="person.avatar"
                :alt="person.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h4 class="font-medium text-sm text-neutral-900">{{ person.name }}</h4>
              <p class="text-xs text-[var(--color-primary)] font-mono">{{ person.role }}</p>
              <p class="text-xs text-neutral-500 mt-2 font-light leading-relaxed">{{ person.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Quality & Verification Banner -->
      <section class="bg-neutral-950 text-white rounded-3xl p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div class="space-y-3 max-w-xl z-10">
          <span class="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold">
            PUBLIC AUDIT LOG
          </span>
          <h3 class="font-serif text-2xl sm:text-3xl font-medium">Verify your lot certificate in seconds.</h3>
          <p class="text-xs text-neutral-400 leading-relaxed font-light">
            Every product vial carries a serial number etched on its tamper-evident seal. Enter it in our catalog or scan via any in-store POS terminal.
          </p>
        </div>

        <div class="flex items-center gap-3 z-10 flex-shrink-0">
          <NuxtLink
            to="/shop"
            class="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
          >
            Explore Verified Shop
          </NuxtLink>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const team = [
  {
    name: 'Dr. Elena Rostova',
    role: 'Head of Chemical Synthesis',
    bio: 'Former senior researcher at Max Planck Institute with 15+ years specializing in peptide sequence purification.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  },
  {
    name: 'Marcus Vance',
    role: 'Chief Technology Architect',
    bio: 'Distributed systems engineer focused on high-throughput POS infrastructure, WebSockets, and real-time inventory ledgering.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  },
  {
    name: 'Dr. Kenji Takahashi',
    role: 'Quality Assurance Director',
    bio: 'Oversees HPLC and mass-spectrometry third-party audits with rigorous ISO 17025 laboratory certification standards.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    name: 'Aria Sterling',
    role: 'Head of Retail & Design',
    bio: 'Pioneered editorial minimalist retail aesthetics and streamlined touch-based cashier user experiences.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  },
];
</script>
