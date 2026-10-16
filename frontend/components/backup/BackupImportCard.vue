<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
    <div class="flex items-center justify-between pb-4 border-b border-black/5">
      <div>
        <span class="text-[10px] font-mono text-rose-600 uppercase tracking-wider font-semibold">DESTRUCTIVE / PRIVILEGED</span>
        <h2 class="text-lg font-bold text-neutral-900">Import & Restore Database Snapshot</h2>
        <p class="text-xs text-neutral-500 mt-0.5">
          Upload a valid JSON database archive to merge or restore product entities, categories, and system data.
        </p>
      </div>
      <span class="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-700 rounded-full font-semibold border border-rose-200">
        Requires 2nd Password Confirmation
      </span>
    </div>

    <!-- Drag & Drop / File Input Area -->
    <div
      class="border-2 border-dashed border-neutral-300 hover:border-black rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-all"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInputRef"
        accept=".json"
        class="hidden"
        @change="handleFileUpload"
      />
      <div class="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-neutral-700 border border-black/5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div class="space-y-1">
        <p class="text-xs font-semibold text-neutral-900">
          {{ selectedFileName ? selectedFileName : 'Click to browse or drag and drop database backup (.json)' }}
        </p>
        <p class="text-[11px] text-neutral-400 font-mono">
          {{ selectedFileSize ? selectedFileSize : 'Maximum snapshot file size: 50MB' }}
        </p>
      </div>
    </div>

    <!-- Preview Area if payload loaded -->
    <div v-if="parsedStats" class="bg-neutral-50 rounded-2xl p-4 border border-black/5 space-y-2 text-xs">
      <div class="flex items-center justify-between font-mono font-semibold text-neutral-800">
        <span>Detected Entities in Snapshot:</span>
        <span class="text-emerald-700">Integrity Verified ✓</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-neutral-600">
        <div>• {{ parsedStats.categories || 0 }} categories</div>
        <div>• {{ parsedStats.products || 0 }} products</div>
        <div>• {{ parsedStats.users || 0 }} user accounts</div>
        <div>• {{ parsedStats.orders || 0 }} orders</div>
      </div>
    </div>

    <!-- Ingest Button -->
    <div class="flex items-center justify-between pt-2">
      <p class="text-xs text-neutral-400">
        Ingest process requires administrator password re-verification.
      </p>
      <button
        @click="$emit('initiate-restore')"
        :disabled="!hasFile"
        class="px-6 py-3 bg-neutral-950 text-white rounded-2xl text-xs font-semibold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Proceed to Secure Ingest</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  hasFile: boolean;
  selectedFileName: string;
  selectedFileSize: string;
  parsedStats: any;
}>();

const emit = defineEmits<{
  (e: 'file-selected', file: File): void;
  (e: 'initiate-restore'): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('file-selected', target.files[0]);
  }
}
</script>
