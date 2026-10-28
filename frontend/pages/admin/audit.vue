<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Full-Height Floating Dark Sidebar -->
    <AdminSidebar />

    <!-- Main Workspace Container -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-6">
      <!-- Header with Role Stats and Action Triggers -->
      <header class="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Security & Governance Audit</h1>
            <span class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              ADMIN EXCLUSIVE AUDIT LOG
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            Cryptographic ledger tracking operational events, cashier transactions, owner restocks, and security permissions.
          </p>
        </div>

        <!-- Filter Controls -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            @click="roleFilter = 'ALL'"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
            :class="roleFilter === 'ALL' ? 'bg-neutral-900 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
          >
            All ({{ auditStore.logs.length }})
          </button>
          <button
            @click="roleFilter = 'OWNER'"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
            :class="roleFilter === 'OWNER' ? 'bg-amber-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Owner ({{ countByRole('OWNER') }})
          </button>
          <button
            @click="roleFilter = 'CASHIER'"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
            :class="roleFilter === 'CASHIER' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Cashier ({{ countByRole('CASHIER') }})
          </button>
          <button
            @click="roleFilter = 'ADMIN'"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap"
            :class="roleFilter === 'ADMIN' ? 'bg-purple-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:text-black'"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Admin ({{ countByRole('ADMIN') }})
          </button>
        </div>
      </header>

      <!-- Access Guard for non-admin -->
      <div v-if="!authStore.isAdmin" class="flex-1 bg-white border border-black/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-neutral-900">Admin Clearance Required</h2>
          <p class="text-xs text-neutral-500 max-w-md">
            This activity ledger inspects privileged cashier overrides and owner financial manipulations. Only authenticated <strong>ADMIN</strong> users can review this log.
          </p>
        </div>
        <NuxtLink to="/admin" class="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-full hover:bg-black transition-colors">
          Return to Dashboard
        </NuxtLink>
      </div>

      <!-- Main Audit Table (ADMIN ONLY) -->
      <div v-else class="flex-1 bg-white border border-black/5 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col overflow-hidden space-y-4">
        <!-- Control Bar: Search + Category Filter + CSV Export -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Search Input -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search actor, SKU, reason, IP..."
                class="bg-neutral-100 text-xs pl-8 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-black w-60 sm:w-72"
              />
              <span class="absolute left-3 top-2.5 text-neutral-400 text-xs">🔍</span>
            </div>

            <!-- Category Selector Filter -->
            <select
              v-model="categoryFilter"
              class="bg-neutral-100 text-xs px-3.5 py-2 rounded-full border-none focus:ring-1 focus:ring-black cursor-pointer font-medium text-neutral-700"
            >
              <option value="ALL">All Categories</option>
              <option value="STOCK_RESTOCK">📦 Stock Replenishment</option>
              <option value="POS_CHECKOUT">💳 POS Checkout</option>
              <option value="PRICE_UPDATE">🏷️ Price Changes</option>
              <option value="FINANCIAL_EXPORT">📊 Financial Exports</option>
              <option value="USER_PROVISION">👤 User Permissions</option>
              <option value="SECURITY_EVENT">🔒 Security & Settings</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-neutral-400 hidden sm:inline">
              Showing {{ filteredActivities.length }} of {{ auditStore.logs.length }} events
            </span>
            <button
              @click="exportAuditCsv"
              class="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Download CSV</span>
              <span>↓</span>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="flex-1 overflow-y-auto pr-1">
          <!-- Empty Filter State -->
          <div
            v-if="filteredActivities.length === 0"
            class="py-16 text-center space-y-2 text-neutral-400 font-mono text-xs"
          >
            <div class="text-3xl mb-1">🔍</div>
            <p class="font-semibold text-neutral-700">No matching audit events</p>
            <p class="text-[11px] text-neutral-400 max-w-sm mx-auto">
              No audit logs matched your query. Clear filters or adjust your search keywords to view past events.
            </p>
          </div>

          <table v-else class="w-full text-left text-xs">
            <thead class="text-neutral-400 uppercase tracking-wider font-mono border-b border-black/5 sticky top-0 bg-white z-10">
              <tr>
                <th class="pb-3 font-medium">Timestamp</th>
                <th class="pb-3 font-medium">Actor</th>
                <th class="pb-3 font-medium">Role</th>
                <th class="pb-3 font-medium">Category</th>
                <th class="pb-3 font-medium">Operational Event</th>
                <th class="pb-3 font-medium text-right">System Context & Metadata</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5">
              <tr
                v-for="act in filteredActivities"
                :key="act.id"
                class="hover:bg-neutral-50/80 transition-colors group cursor-default"
              >
                <!-- Timestamp -->
                <td class="py-3 font-mono text-neutral-500 whitespace-nowrap">
                  {{ act.timeAgo }}
                </td>

                <!-- Actor -->
                <td class="py-3 font-semibold text-neutral-900 whitespace-nowrap">
                  {{ act.actorName }}
                </td>

                <!-- Role Badge -->
                <td class="py-3 whitespace-nowrap">
                  <span
                    class="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full"
                    :class="{
                      'bg-amber-100 text-amber-800': act.role === 'OWNER',
                      'bg-emerald-100 text-emerald-800': act.role === 'CASHIER',
                      'bg-purple-100 text-purple-800': act.role === 'ADMIN',
                      'bg-neutral-200 text-neutral-800': act.role === 'SYSTEM',
                    }"
                  >
                    {{ act.role }}
                  </span>
                </td>

                <!-- Category Badge -->
                <td class="py-3 whitespace-nowrap">
                  <span
                    class="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold border"
                    :class="getCategoryBadgeClass(act.category)"
                  >
                    {{ formatCategoryText(act.category) }}
                  </span>
                </td>

                <!-- Description -->
                <td class="py-3 font-medium text-neutral-800">
                  {{ act.actionDescription }}
                </td>

                <!-- Metadata / Terminal ID -->
                <td class="py-3 text-right font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                  <span class="bg-neutral-100 px-2.5 py-1 rounded-lg">
                    {{ act.meta }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAuditStore, type AuditLogItem } from '~/stores/audit';
import { useAlertStore } from '~/stores/alert';
import AdminSidebar from '~/components/AdminSidebar.vue';

const authStore = useAuthStore();
const auditStore = useAuditStore();
const alertStore = useAlertStore();

const roleFilter = ref<'ALL' | 'OWNER' | 'CASHIER' | 'ADMIN' | 'SYSTEM'>('ALL');
const categoryFilter = ref<string>('ALL');
const searchQuery = ref('');

function countByRole(role: string) {
  return auditStore.logs.filter((l) => l.role === role).length;
}

function getCategoryBadgeClass(category?: string) {
  switch (category) {
    case 'STOCK_RESTOCK':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'POS_CHECKOUT':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'PRICE_UPDATE':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'USER_PROVISION':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'FINANCIAL_EXPORT':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    default:
      return 'bg-neutral-50 text-neutral-700 border-neutral-200';
  }
}

function formatCategoryText(category?: string) {
  if (!category) return 'General';
  return category.replace(/_/g, ' ');
}

const filteredActivities = computed(() => {
  return auditStore.logs.filter((act) => {
    const matchesRole = roleFilter.value === 'ALL' || act.role === roleFilter.value;
    const matchesCategory = categoryFilter.value === 'ALL' || act.category === categoryFilter.value;
    const matchesSearch =
      !searchQuery.value ||
      act.actorName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      act.actionDescription.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (act.category && act.category.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (act.meta && act.meta.toLowerCase().includes(searchQuery.value.toLowerCase()));

    return matchesRole && matchesCategory && matchesSearch;
  });
});

function exportAuditCsv() {
  const items = filteredActivities.value;
  if (items.length === 0) {
    alertStore.info('No audit logs available to export.', 'Empty Export');
    return;
  }

  const headers = ['Timestamp', 'Actor Name', 'Role', 'Category', 'Action Description', 'System Metadata'];
  const rows = items.map((item) => [
    `"${item.timeAgo}"`,
    `"${item.actorName}"`,
    `"${item.role}"`,
    `"${item.category || 'General'}"`,
    `"${item.actionDescription.replace(/"/g, '""')}"`,
    `"${(item.meta || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `audit_trail_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alertStore.success(`Successfully exported ${items.length} audit trail records to CSV!`, 'Export Completed');
}
</script>
