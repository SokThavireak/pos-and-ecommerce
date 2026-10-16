<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-black/5">
        <div class="flex items-center gap-2.5">
          <div
            class="w-9 h-9 rounded-2xl flex items-center justify-center border"
            :class="mode === 'EXPORT' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-rose-50 text-rose-600 border-rose-200'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-neutral-900">Administrator Clearance</h3>
            <p class="text-[11px] text-neutral-400 font-mono">
              {{ mode === 'EXPORT' ? '2nd Confirmation for Database Export' : '2nd Confirmation for Database Import' }}
            </p>
          </div>
        </div>
        <button @click="$emit('cancel')" class="text-neutral-400 hover:text-black font-mono">✕</button>
      </div>

      <!-- Warning Callout -->
      <div
        class="rounded-2xl p-4 text-xs space-y-1.5"
        :class="mode === 'EXPORT' ? 'bg-purple-50 border border-purple-200 text-purple-900' : 'bg-amber-50 border border-amber-200 text-amber-900'"
      >
        <p class="font-bold flex items-center gap-1.5">
          <span>🔒</span>
          <span>{{ mode === 'EXPORT' ? 'Privileged Sensitive Data Extraction' : 'Caution: Database State Modification' }}</span>
        </p>
        <p class="text-[11px] leading-relaxed" :class="mode === 'EXPORT' ? 'text-purple-800' : 'text-amber-800'">
          {{
            mode === 'EXPORT'
              ? 'Exporting database snapshots reveals sensitive client hashes, order histories, and store settings. Please re-enter your administrator credentials.'
              : 'Importing a snapshot alters or creates entities in the live PostgreSQL database. Please confirm your administrative password to execute this operation.'
          }}
        </p>
      </div>

      <!-- Password Input Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
        <div>
          <label class="block text-neutral-700 font-semibold mb-1.5">
            Admin Password Confirmation
          </label>
          <input
            type="password"
            v-model="password"
            required
            autocomplete="current-password"
            placeholder="Enter admin password (e.g. admin123)..."
            class="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
          />
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1.5">
            Reason for Restore (Audit Log Record)
          </label>
          <input
            type="text"
            v-model="reason"
            placeholder="e.g. Disaster recovery restore, catalog synchronization"
            class="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div v-if="errorMessage" class="text-xs text-rose-600 font-medium font-mono">
          ✕ {{ errorMessage }}
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-black/5">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isProcessing"
            class="px-6 py-2.5 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            :class="mode === 'EXPORT' ? 'bg-neutral-900 hover:bg-black' : 'bg-rose-600 hover:bg-rose-700'"
          >
            <svg v-if="isProcessing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span v-else>
              {{ mode === 'EXPORT' ? 'Authorize & Download Snapshot' : 'Verify & Import Database' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    show: boolean;
    mode?: 'EXPORT' | 'RESTORE';
    isProcessing: boolean;
    errorMessage: string;
  }>(),
  {
    mode: 'RESTORE',
  }
);

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm', payload: { password: string; reason: string }): void;
}>();

const password = ref('');
const reason = ref('Disaster recovery snapshot');

function handleSubmit() {
  if (!password.value) return;
  emit('confirm', {
    password: password.value,
    reason: reason.value,
  });
  password.value = '';
}
</script>
