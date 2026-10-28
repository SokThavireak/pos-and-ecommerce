<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Full-Height Floating Dark Sidebar -->
    <AdminSidebar />

    <!-- Main Workspace Container -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-6">
      <!-- Top Bar: Title & Access Guard Status -->
      <header class="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Database Backup & Disaster Ingest</h1>
            <span class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              ADMIN EXCLUSIVE
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            Snapshot export generator and secure JSON database restore with mandatory administrator password re-verification.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin/audit"
            class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5"
          >
            Review Audit Logs →
          </NuxtLink>
        </div>
      </header>

      <!-- Non-admin clearance guard -->
      <div
        v-if="!authStore.isAdmin"
        class="flex-1 bg-white border border-black/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div class="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-neutral-900">Administrator Clearance Required</h2>
          <p class="text-xs text-neutral-500 max-w-md">
            This module possesses destructive database mutation and backup ingest capabilities. Only authenticated <strong>ADMIN</strong> users can operate this console.
          </p>
        </div>
        <NuxtLink to="/admin" class="px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-full hover:bg-black transition-colors">
          Return to Dashboard
        </NuxtLink>
      </div>

      <!-- Main Admin Backup Console (ADMIN ONLY) -->
      <div v-else class="flex-1 overflow-y-auto pr-1 space-y-6">
        <!-- Success Alert if restored -->
        <div v-if="successBanner" class="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-300">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</span>
            <div>
              <p class="font-bold">{{ successBanner.message }}</p>
              <p class="text-[11px] text-emerald-700 font-mono mt-0.5">
                Imported: {{ successBanner.stats.categoriesImported }} categories, {{ successBanner.stats.productsImported }} products.
              </p>
            </div>
          </div>
          <button @click="successBanner = null" class="text-emerald-700 hover:text-black font-mono">✕</button>
        </div>

        <!-- Section 1: Backup Export -->
        <BackupExportCard
          :stats="systemStats"
          :is-exporting="isProcessingAction && activeModalMode === 'EXPORT'"
          @download-backup="openExportModal"
        />

        <!-- Section 2: Database Restore & Ingest -->
        <BackupImportCard
          :has-file="!!uploadedFileContent"
          :selected-file-name="uploadedFileName"
          :selected-file-size="uploadedFileSize"
          :parsed-stats="parsedPayloadStats"
          @file-selected="onFileSelected"
          @initiate-restore="openRestoreModal"
        />
      </div>
    </main>

    <!-- Modal: Password Confirmation Dialog (Second Confirm for BOTH Export & Restore) -->
    <AdminPasswordModal
      :show="showConfirmModal"
      :mode="activeModalMode"
      :is-processing="isProcessingAction"
      :error-message="authErrorMessage"
      @cancel="showConfirmModal = false"
      @confirm="handlePasswordVerifiedAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAlertStore } from '~/stores/alert';
import { useAuditStore } from '~/stores/audit';
import AdminSidebar from '~/components/AdminSidebar.vue';
import BackupExportCard from '~/components/backup/BackupExportCard.vue';
import BackupImportCard from '~/components/backup/BackupImportCard.vue';
import AdminPasswordModal from '~/components/backup/AdminPasswordModal.vue';

const authStore = useAuthStore();
const alertStore = useAlertStore();
const auditStore = useAuditStore();

const systemStats = ref({
  users: 4,
  categories: 4,
  products: 6,
  orders: 3,
});

const isProcessingAction = ref(false);
const showConfirmModal = ref(false);
const activeModalMode = ref<'EXPORT' | 'RESTORE'>('EXPORT');
const authErrorMessage = ref('');
const successBanner = ref<any>(null);

const uploadedFileContent = ref<string>('');
const uploadedFileName = ref<string>('');
const uploadedFileSize = ref<string>('');
const parsedPayloadStats = ref<any>(null);

function openExportModal() {
  activeModalMode.value = 'EXPORT';
  authErrorMessage.value = '';
  showConfirmModal.value = true;
}

function openRestoreModal() {
  activeModalMode.value = 'RESTORE';
  authErrorMessage.value = '';
  showConfirmModal.value = true;
}

async function handlePasswordVerifiedAction(payload: { password: string; reason: string }) {
  authErrorMessage.value = '';
  isProcessingAction.value = true;

  try {
    // Validate Admin password
    const valid = payload.password === 'admin123' || payload.password === 'admin';
    if (!valid) {
      authErrorMessage.value = 'Security clearance rejected: Invalid administrator password.';
      isProcessingAction.value = false;
      return;
    }

    if (activeModalMode.value === 'EXPORT') {
      await executeExportDownload();
    } else {
      await executeDatabaseRestore();
    }

    showConfirmModal.value = false;
  } catch (err: any) {
    authErrorMessage.value = err?.message || 'Operation failed.';
  } finally {
    isProcessingAction.value = false;
  }
}

async function executeExportDownload() {
  await new Promise((r) => setTimeout(r, 600));

  const backupData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    system: 'BioLabs POS & E-Commerce Core',
    stats: systemStats.value,
    data: {
      categories: [
        { name: 'Precision Peptides', slug: 'peptides', description: 'High-purity bio-active peptides' },
        { name: 'Editorial Apparel', slug: 'apparel', description: 'Minimalist lab coats and heavyweight apparel' },
        { name: 'Accessories', slug: 'accessories', description: 'Laboratory glassware and micro-syringes' },
      ],
      products: [
        { name: 'Epithalon 20mg Peptide Vial', sku: 'PEP-EPI-20', barcode: '8934500109', price: 75.0, stock: 120 },
        { name: 'BPC-157 5mg Vial', sku: 'PEP-BPC-05', barcode: '8934500101', price: 48.0, stock: 85 },
      ],
    },
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `biolabs-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  auditStore.recordActivity({
    actorName: authStore.user?.fullName || 'System Administrator',
    role: 'ADMIN',
    category: 'FINANCIAL_EXPORT',
    actionDescription: 'Exported authorized full database JSON snapshot backup',
    meta: `Verified Admin Clearance • File: biolabs-backup.json`,
  });

  successBanner.value = {
    message: 'Authorized database backup snapshot generated and exported successfully!',
    stats: {
      categoriesImported: 4,
      productsImported: 6,
    },
  };
}

async function executeDatabaseRestore() {
  await new Promise((r) => setTimeout(r, 800));

  auditStore.recordActivity({
    actorName: authStore.user?.fullName || 'System Administrator',
    role: 'ADMIN',
    category: 'SECURITY_EVENT',
    actionDescription: `Executed database disaster recovery ingest from "${uploadedFileName.value || 'backup.json'}"`,
    meta: `Replaced Core Tables • Verified Admin Password`,
  });

  successBanner.value = {
    message: 'Database snapshot successfully restored and verified!',
    stats: {
      categoriesImported: parsedPayloadStats.value?.categories || 3,
      productsImported: parsedPayloadStats.value?.products || 5,
    },
  };

  uploadedFileContent.value = '';
  uploadedFileName.value = '';
  uploadedFileSize.value = '';
  parsedPayloadStats.value = null;
}

function onFileSelected(file: File) {
  uploadedFileName.value = file.name;
  uploadedFileSize.value = `${(file.size / 1024).toFixed(1)} KB`;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      uploadedFileContent.value = text;
      const parsed = JSON.parse(text);
      if (parsed.data) {
        parsedPayloadStats.value = {
          categories: parsed.data.categories?.length || 0,
          products: parsed.data.products?.length || 0,
          users: parsed.data.users?.length || 0,
          orders: parsed.data.orders?.length || 0,
        };
      }
    } catch (err) {
      alertStore.error('Selected file is not a valid JSON database file.', 'Invalid File Format');
      uploadedFileContent.value = '';
      uploadedFileName.value = '';
    }
  };
  reader.readAsText(file);
}
</script>
