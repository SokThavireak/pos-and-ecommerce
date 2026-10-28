<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Full-Height Floating Dark Sidebar -->
    <AdminSidebar />

    <!-- Main Profile Workspace -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-6">
      <!-- Top Bar -->
      <header class="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">User Profile & Credentials</h1>
            <span
              class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full"
              :class="{
                'bg-amber-100 text-amber-800': authStore.isOwner,
                'bg-purple-100 text-purple-800': authStore.isAdmin,
                'bg-emerald-100 text-emerald-800': authStore.isCashier,
                'bg-blue-100 text-blue-800': authStore.isCustomer,
              }"
            >
              {{ authStore.currentRole }} ROLE
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            Manage your authenticated session, personal identity details, security credentials, and system permissions.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/login"
            class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5"
          >
            Switch Role Account ⇄
          </NuxtLink>
        </div>
      </header>

      <!-- Profile Workspace Body (2-Column Grid) -->
      <div class="flex-1 overflow-y-auto pr-1">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Identity Summary Card (4 cols) -->
          <div class="lg:col-span-4 bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6 flex flex-col items-center text-center">
            <div class="relative group cursor-pointer">
              <img
                :src="authStore.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'"
                :alt="authStore.user?.fullName"
                class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <span
                class="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white shadow-xs"
                :class="{
                  'bg-amber-500': authStore.isOwner,
                  'bg-purple-600': authStore.isAdmin,
                  'bg-emerald-500': authStore.isCashier,
                  'bg-blue-500': authStore.isCustomer,
                }"
              ></span>
            </div>

            <div class="space-y-1">
              <h2 class="text-lg font-bold text-neutral-900">{{ authStore.user?.fullName || 'Authenticated User' }}</h2>
              <p class="text-xs text-neutral-400 font-mono">{{ authStore.user?.email || 'user@biolabs.com' }}</p>
              <span
                class="inline-block mt-2 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                :class="{
                  'bg-amber-100 text-amber-800': authStore.isOwner,
                  'bg-purple-100 text-purple-800': authStore.isAdmin,
                  'bg-emerald-100 text-emerald-800': authStore.isCashier,
                  'bg-blue-100 text-blue-800': authStore.isCustomer,
                }"
              >
                {{ authStore.currentRole }} ACCESS CLEARANCE
              </span>
            </div>

            <div class="w-full border-t border-black/5 pt-4 space-y-2 text-xs text-neutral-500 font-mono text-left">
              <div class="flex justify-between">
                <span>User ID:</span>
                <span class="text-neutral-900 font-bold truncate max-w-[150px]">{{ authStore.user?.id || 'usr-master' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Auth Method:</span>
                <span class="text-neutral-900 font-bold">Encrypted JWT</span>
              </div>
              <div class="flex justify-between">
                <span>Session Status:</span>
                <span class="text-emerald-600 font-bold">Active & Verified</span>
              </div>
            </div>

            <button
              @click="authStore.logout(); navigateTo('/login');"
              class="w-full py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors border border-rose-200"
            >
              Log Out Session
            </button>
          </div>

          <!-- Right Column: Profile Form & Privileges Ledger (8 cols) -->
          <div class="lg:col-span-8 space-y-6">
            <!-- Edit Profile Details Card -->
            <div class="bg-white border border-black/5 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div class="flex items-center justify-between pb-3 border-b border-black/5">
                <div>
                  <h3 class="text-base font-bold text-neutral-900">Personal Information</h3>
                  <p class="text-xs text-neutral-400">Update your display name, contact email, and avatar photo.</p>
                </div>
                <span v-if="savedSuccess" class="text-xs text-emerald-600 font-mono font-bold animate-in fade-in">
                  Profile Saved Successfully ✓
                </span>
              </div>

              <form @submit.prevent="saveProfile" class="space-y-4 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-neutral-700 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      v-model="profileForm.fullName"
                      required
                      class="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label class="block text-neutral-700 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      v-model="profileForm.email"
                      required
                      class="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-neutral-700 font-medium mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    v-model="profileForm.avatarUrl"
                    class="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div class="pt-2 flex justify-end">
                  <button
                    type="submit"
                    class="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-semibold hover:bg-[var(--color-primary)] transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <!-- Role Privileges Inspection Matrix -->
            <div class="bg-white border border-black/5 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 class="text-base font-bold text-neutral-900">Assigned Role Permissions</h3>
              <p class="text-xs text-neutral-500">Privileges granted to your account under the RBAC security policy.</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div class="p-3.5 rounded-2xl border border-black/5 flex items-center justify-between" :class="authStore.isOwner ? 'bg-amber-50/50 border-amber-200' : 'bg-neutral-50'">
                  <span class="text-neutral-700">Financials & Business Analytics</span>
                  <span class="font-bold" :class="authStore.isOwner ? 'text-amber-800' : 'text-neutral-400'">{{ authStore.isOwner ? 'GRANTED' : 'RESTRICTED' }}</span>
                </div>
                <div class="p-3.5 rounded-2xl border border-black/5 flex items-center justify-between" :class="authStore.isAdmin ? 'bg-purple-50/50 border-purple-200' : 'bg-neutral-50'">
                  <span class="text-neutral-700">Brand Customization Studio</span>
                  <span class="font-bold" :class="authStore.isAdmin ? 'text-purple-800' : 'text-neutral-400'">{{ authStore.isAdmin ? 'ADMIN ONLY' : 'RESTRICTED' }}</span>
                </div>
                <div class="p-3.5 rounded-2xl border border-black/5 flex items-center justify-between" :class="authStore.isAdmin ? 'bg-purple-50/50 border-purple-200' : 'bg-neutral-50'">
                  <span class="text-neutral-700">Security & Governance Audit</span>
                  <span class="font-bold" :class="authStore.isAdmin ? 'text-purple-800' : 'text-neutral-400'">{{ authStore.isAdmin ? 'ADMIN ONLY' : 'RESTRICTED' }}</span>
                </div>
                <div class="p-3.5 rounded-2xl border border-black/5 flex items-center justify-between" :class="authStore.canAccessPOS ? 'bg-emerald-50/50 border-emerald-200' : 'bg-neutral-50'">
                  <span class="text-neutral-700">POS Counter Barcode Terminal</span>
                  <span class="font-bold" :class="authStore.canAccessPOS ? 'text-emerald-800' : 'text-neutral-400'">{{ authStore.canAccessPOS ? 'AUTHORIZED' : 'RESTRICTED' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AdminSidebar from '~/components/AdminSidebar.vue';

const authStore = useAuthStore();
const savedSuccess = ref(false);

const profileForm = reactive({
  fullName: authStore.user?.fullName || 'Alexander Wright',
  email: authStore.user?.email || 'owner@biolabs.com',
  avatarUrl: authStore.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
});

function saveProfile() {
  if (authStore.user) {
    authStore.user.fullName = profileForm.fullName;
    authStore.user.email = profileForm.email;
    authStore.user.avatarUrl = profileForm.avatarUrl;
  }
  savedSuccess.value = true;
  setTimeout(() => {
    savedSuccess.value = false;
  }, 2500);
}
</script>
