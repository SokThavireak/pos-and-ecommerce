<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Provision New User Form (5 cols) -->
    <div class="lg:col-span-5 bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
      <div>
        <span class="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">RBAC ACCESS</span>
        <h2 class="text-lg font-bold text-neutral-900">Create New User</h2>
        <p class="text-xs text-neutral-500 mt-0.5">Assign access privileges for cashiers, managers, or admins.</p>
      </div>

      <form @submit.prevent="handleCreate" class="space-y-3.5 text-xs">
        <div>
          <label class="block text-neutral-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            v-model="newUser.fullName"
            required
            placeholder="e.g. Sarah Jenkins"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Email Address</label>
          <input
            type="email"
            v-model="newUser.email"
            required
            placeholder="name@biolabs.com"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Assigned Role</label>
          <select
            v-model="newUser.role"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-medium cursor-pointer"
          >
            <option value="CASHIER">CASHIER (POS Counter Terminal Access)</option>
            <option value="ADMIN">ADMIN (Brand Studio & System Customization)</option>
            <option value="CUSTOMER">CUSTOMER (Client Storefront & Orders)</option>
            <option value="OWNER">OWNER (Full Business & Financial Authority)</option>
          </select>
        </div>

        <div>
          <label class="block text-neutral-700 font-medium mb-1">Temporary Password</label>
          <input
            type="password"
            v-model="newUser.password"
            required
            placeholder="••••••••••••"
            class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-neutral-950 text-white rounded-xl font-semibold text-xs hover:bg-[var(--color-primary)] transition-colors shadow-sm mt-2"
        >
          Provision Account
        </button>
      </form>
    </div>

    <!-- Existing Users List (7 cols) -->
    <div class="lg:col-span-7 bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-neutral-900">Active Team & Users</h3>
          <p class="text-xs text-neutral-500">{{ users.length }} accounts recorded</p>
        </div>
        <span class="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
          JWT Active
        </span>
      </div>

      <div class="divide-y divide-black/5">
        <div
          v-for="u in users"
          :key="u.id"
          class="py-3 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <img :src="u.avatarUrl" :alt="u.fullName" class="w-10 h-10 rounded-full object-cover bg-neutral-100" />
            <div>
              <p class="text-xs font-semibold text-neutral-900">{{ u.fullName }}</p>
              <p class="text-[11px] text-neutral-400 font-mono">{{ u.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full"
              :class="{
                'bg-amber-100 text-amber-800': u.role === 'OWNER',
                'bg-purple-100 text-purple-800': u.role === 'ADMIN',
                'bg-emerald-100 text-emerald-800': u.role === 'CASHIER',
                'bg-blue-100 text-blue-800': u.role === 'CUSTOMER',
              }"
            >
              {{ u.role }}
            </span>
            <button
              @click="$emit('edit-user', u)"
              class="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
            >
              Edit
            </button>
            <button
              @click="$emit('delete-user', u.id)"
              class="text-neutral-400 hover:text-red-600 p-1 transition-colors"
              title="Remove user"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps<{
  users: Array<{
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl: string;
  }>;
}>();

const emit = defineEmits<{
  (e: 'create-user', payload: { fullName: string; email: string; role: string; password: string }): void;
  (e: 'edit-user', user: any): void;
  (e: 'delete-user', id: string): void;
}>();

const newUser = reactive({
  fullName: '',
  email: '',
  role: 'CASHIER',
  password: '',
});

function handleCreate() {
  emit('create-user', { ...newUser });
  newUser.fullName = '';
  newUser.email = '';
  newUser.role = 'CASHIER';
  newUser.password = '';
}
</script>
