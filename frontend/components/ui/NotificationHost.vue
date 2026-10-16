<template>
  <div class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
    <!-- Top-Right Floating Toast Container -->
    <div class="absolute top-6 right-6 flex flex-col gap-3 max-w-sm w-full pointer-events-auto">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-for="toast in alertStore.toasts"
          :key="toast.id"
          class="bg-[#141414]/95 text-white backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 select-none"
        >
          <!-- Icon indicator -->
          <div
            class="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
            :class="{
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40': toast.type === 'success',
              'bg-rose-500/20 text-rose-400 border border-rose-500/40': toast.type === 'error',
              'bg-amber-500/20 text-amber-400 border border-amber-500/40': toast.type === 'warning',
              'bg-blue-500/20 text-blue-400 border border-blue-500/40': toast.type === 'info',
            }"
          >
            <span v-if="toast.type === 'success'">✓</span>
            <span v-else-if="toast.type === 'error'">✕</span>
            <span v-else-if="toast.type === 'warning'">⚠</span>
            <span v-else>ℹ</span>
          </div>

          <!-- Message Body -->
          <div class="flex-1 space-y-0.5">
            <h4 class="text-xs font-semibold tracking-tight text-white">{{ toast.title }}</h4>
            <p class="text-[11px] text-neutral-300 font-light leading-relaxed">{{ toast.message }}</p>
          </div>

          <!-- Dismiss button -->
          <button
            @click="alertStore.removeToast(toast.id)"
            class="text-neutral-500 hover:text-white transition-colors text-xs p-1"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Center Modal Dialog for Confirmations -->
    <div
      v-if="alertStore.confirmModal.show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4 z-[10000]"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-start gap-3.5">
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            :class="{
              'bg-rose-50 text-rose-600 border border-rose-200': alertStore.confirmModal.type === 'danger',
              'bg-amber-50 text-amber-600 border border-amber-200': alertStore.confirmModal.type === 'warning',
              'bg-emerald-50 text-emerald-600 border border-emerald-200': alertStore.confirmModal.type === 'success',
              'bg-neutral-100 text-neutral-800': alertStore.confirmModal.type === 'info',
            }"
          >
            <span v-if="alertStore.confirmModal.type === 'danger'">✕</span>
            <span v-else-if="alertStore.confirmModal.type === 'warning'">⚠️</span>
            <span v-else>ℹ</span>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-neutral-900">{{ alertStore.confirmModal.title }}</h3>
            <p class="text-xs text-neutral-500 leading-relaxed">{{ alertStore.confirmModal.message }}</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5">
          <button
            type="button"
            @click="alertStore.handleConfirm(false)"
            class="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 text-xs font-semibold transition-colors"
          >
            {{ alertStore.confirmModal.cancelText }}
          </button>
          <button
            type="button"
            @click="alertStore.handleConfirm(true)"
            class="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all"
            :class="alertStore.confirmModal.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-neutral-950 hover:bg-black'"
          >
            {{ alertStore.confirmModal.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert';

const alertStore = useAlertStore();
</script>
