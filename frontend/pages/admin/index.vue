<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Floating Vertical Dark Pill Sidebar -->
    <AdminSidebar />

    <!-- Main Dashboard Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-6">
      <!-- Top Bar: Overview Header + Search + POS Launcher -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/5 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Overview</h1>
            <span class="text-xs bg-emerald-100 text-emerald-800 font-mono font-semibold px-2.5 py-0.5 rounded-full">
              Live POS Connected
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">Detailed real-time metrics and multichannel inventory sync.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative">
            <input
              type="text"
              placeholder="Search orders, SKU..."
              class="bg-neutral-100 text-xs px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-black w-48 sm:w-64"
            />
          </div>
          <NuxtLink
            to="/pos"
            class="px-4 py-2 bg-neutral-900 text-white rounded-full text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5"
          >
            Launch POS Terminal
          </NuxtLink>
        </div>
      </header>

      <!-- Scrollable Dashboard Area -->
      <div class="flex-1 overflow-y-auto pr-1 space-y-6">
        <!-- Row 1: Sales Analytics (8 cols) + KPI Stack (4 cols) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <SalesAnalyticsChart :bars="monthlyBars" />
          <KpiMetricsStack />
        </div>

        <!-- Row 2: Sales by Country (4 cols) + Top Products (8 cols) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <CountrySalesDonut />
          <ProductSalesTable :products="topProducts" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/AdminSidebar.vue';
import SalesAnalyticsChart from '~/components/admin/SalesAnalyticsChart.vue';
import KpiMetricsStack from '~/components/admin/KpiMetricsStack.vue';
import CountrySalesDonut from '~/components/admin/CountrySalesDonut.vue';
import ProductSalesTable from '~/components/admin/ProductSalesTable.vue';

const monthlyBars = [
  { month: 'Jan', pos: 45, web: 35 },
  { month: 'Feb', pos: 55, web: 40 },
  { month: 'Mar', pos: 40, web: 50 },
  { month: 'Apr', pos: 60, web: 55 },
  { month: 'May', pos: 70, web: 65 },
  { month: 'Jun', pos: 85, web: 75 },
  { month: 'Jul', pos: 95, web: 80 },
  { month: 'Aug', pos: 75, web: 60 },
  { month: 'Sep', pos: 65, web: 50 },
  { month: 'Oct', pos: 80, web: 70 },
  { month: 'Nov', pos: 90, web: 85 },
  { month: 'Dec', pos: 88, web: 80 },
];

const topProducts = [
  {
    name: 'Epithalon 20mg Peptide Vial',
    category: 'Precision Peptides',
    price: 75.00,
    units: 342,
    channel: '62% POS / 38% Web',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'BPC-157 5mg Vial',
    category: 'Precision Peptides',
    price: 48.00,
    units: 289,
    channel: '71% POS / 29% Web',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Structured Lab Oversized Tee',
    category: 'Editorial Apparel',
    price: 95.00,
    units: 198,
    channel: '25% POS / 75% Web',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Minimalist Research Lab Coat',
    category: 'Editorial Apparel',
    price: 210.00,
    units: 64,
    channel: '18% POS / 82% Web',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80',
  },
];
</script>
