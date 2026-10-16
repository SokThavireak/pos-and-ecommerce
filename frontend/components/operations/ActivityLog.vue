<template>
  <div class="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">SECURITY & GOVERNANCE</span>
        <h2 class="text-xl font-bold text-neutral-900">Unified Activity Audit Trail</h2>
        <p class="text-xs text-neutral-500">Chronological activity record of every operational action performed by Owners, Admins, and Cashiers.</p>
      </div>
      <span class="text-xs font-mono text-neutral-400">Live Recording</span>
    </div>

    <div class="divide-y divide-black/5">
      <div
        v-for="act in logs"
        :key="act.id"
        class="py-3.5 flex items-start gap-4 hover:bg-neutral-50/80 transition-colors rounded-xl px-2"
      >
        <div
          class="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
          :class="{
            'bg-amber-100 text-amber-800': act.role === 'OWNER',
            'bg-emerald-100 text-emerald-800': act.role === 'CASHIER',
            'bg-purple-100 text-purple-800': act.role === 'ADMIN',
          }"
        >
          {{ act.role[0] }}
        </div>

        <div class="flex-1 space-y-0.5">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-neutral-900">
              {{ act.actorName }}
              <span class="font-mono text-[10px] text-neutral-400">({{ act.role }})</span>
            </p>
            <span class="text-[11px] font-mono text-neutral-400">{{ act.timeAgo }}</span>
          </div>
          <p class="text-xs text-neutral-600 font-light">{{ act.actionDescription }}</p>
          <p class="text-[11px] font-mono text-neutral-400 pt-0.5">{{ act.meta }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  logs: Array<{
    id: string;
    actorName: string;
    role: string;
    actionDescription: string;
    timeAgo: string;
    meta: string;
  }>;
}>();
</script>
