<template>
  <div>
    <!-- Edit User Modal -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-black/5">
          <h3 class="text-base font-bold text-neutral-900">Edit User Details</h3>
          <button @click="$emit('close-user-modal')" class="text-neutral-400 hover:text-black font-mono">✕</button>
        </div>
        <form @submit.prevent="$emit('save-user')" class="space-y-3 text-xs">
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              v-model="editUser.fullName"
              required
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Email</label>
            <input
              type="email"
              v-model="editUser.email"
              required
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Role</label>
            <select
              v-model="editUser.role"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black font-medium"
            >
              <option value="CASHIER">CASHIER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="OWNER">OWNER</option>
            </select>
          </div>
          <div class="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              @click="$emit('close-user-modal')"
              class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-neutral-950 text-white rounded-xl font-semibold hover:bg-[var(--color-primary)] transition-colors"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Item Modal -->
    <div
      v-if="showItemModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-black/5">
          <div>
            <h3 class="text-base font-bold text-neutral-900">Edit Catalog Item</h3>
            <p class="text-xs text-neutral-500 font-mono">{{ editItem.sku }}</p>
          </div>
          <button @click="$emit('close-item-modal')" class="text-neutral-400 hover:text-black font-mono">✕</button>
        </div>
        <form @submit.prevent="$emit('save-item')" class="space-y-3.5 text-xs">
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Product Title</label>
            <input
              type="text"
              v-model="editItem.name"
              required
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-neutral-700 font-medium mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                v-model.number="editItem.price"
                required
                class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label class="block text-neutral-700 font-medium mb-1">Stock Units</label>
              <input
                type="number"
                v-model.number="editItem.stock"
                required
                class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Specification</label>
            <input
              type="text"
              v-model="editItem.spec"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label class="block text-neutral-700 font-medium mb-1">Image URL</label>
            <input
              type="text"
              v-model="editItem.imageUrl"
              class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
            />
          </div>
          <div class="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              @click="$emit('close-item-modal')"
              class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-neutral-950 text-white rounded-xl font-semibold hover:bg-[var(--color-primary)] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showUserModal: boolean;
  showItemModal: boolean;
  editUser: any;
  editItem: any;
}>();

defineEmits<{
  (e: 'close-user-modal'): void;
  (e: 'close-item-modal'): void;
  (e: 'save-user'): void;
  (e: 'save-item'): void;
}>();
</script>
