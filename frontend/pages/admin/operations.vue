<template>
  <div class="h-screen bg-[#f4f5f7] p-3 sm:p-5 flex gap-5 antialiased overflow-hidden">
    <!-- Full-Height Floating Dark Sidebar -->
    <AdminSidebar />

    <!-- Main Workspace Container -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      <!-- Top Bar: Title + Tab Navigation -->
      <header class="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Operations Hub</h1>
            <span class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white">
              {{ authStore.currentRole }} WORKSPACE
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            User management, product catalog creation, stock inventory ledger, order fulfillment, and audit trail.
          </p>
        </div>

        <!-- Tab Bar Switcher -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-neutral-100 p-1.5 rounded-2xl">
          <button
            v-for="tab in availableTabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5"
            :class="currentTab === tab.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-black'"
          >
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.badge"
              class="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
              :class="currentTab === tab.id ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-700'"
            >
              {{ tab.badge }}
            </span>
          </button>
        </div>
      </header>

      <!-- Scrollable Tab Content Area -->
      <div class="flex-1 overflow-y-auto pr-1 space-y-6">
        <!-- TAB 1: CREATE USER & TEAM DIRECTORY -->
        <UserManagement
          v-if="currentTab === 'users'"
          :users="usersList"
          @create-user="handleCreateUser"
          @edit-user="openEditUser"
          @delete-user="deleteUser"
        />

        <!-- TAB 2: CREATE ITEM & CATALOG SPEC -->
        <ItemCreation
          v-if="currentTab === 'items'"
          :items="catalogItems"
          @create-item="handleCreateItem"
          @edit-item="openEditItem"
        />

        <!-- TAB 3: STOCK & RESTOCK MANAGEMENT -->
        <StockManagement
          v-if="currentTab === 'stock'"
          :items="catalogItems"
          @adjust-stock="adjustStock"
          @set-stock="setStockDirect"
        />

        <!-- TAB 4: STOCK AUDIT HISTORY (LEDGER) -->
        <StockHistoryLedger
          v-if="currentTab === 'history-stock'"
          :logs="stockHistoryLogs"
        />

        <!-- TAB 5: ACCEPT & FULFILL ORDERS -->
        <OrderFulfillment
          v-if="currentTab === 'orders'"
          :orders="ordersQueue"
          @update-status="updateOrderStatus"
        />

        <!-- TAB 6: AUDIT TRAIL & CASHIER/OWNER ACTIONS -->
        <ActivityLog
          v-if="currentTab === 'activity'"
          :logs="activityLogs"
        />
      </div>
    </main>

    <!-- Modals (Edit User & Edit Item) -->
    <OperationsModals
      :show-user-modal="showEditUserModal"
      :show-item-modal="showEditItemModal"
      :edit-user="activeEditUser"
      :edit-item="activeEditItem"
      @close-user-modal="showEditUserModal = false"
      @close-item-modal="showEditItemModal = false"
      @save-user="saveUserEdit"
      @save-item="saveItemEdits"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAlertStore } from '~/stores/alert';
import { useAuditStore } from '~/stores/audit';
import AdminSidebar from '~/components/AdminSidebar.vue';
import UserManagement from '~/components/operations/UserManagement.vue';
import ItemCreation from '~/components/operations/ItemCreation.vue';
import StockManagement from '~/components/operations/StockManagement.vue';
import StockHistoryLedger from '~/components/operations/StockHistoryLedger.vue';
import OrderFulfillment from '~/components/operations/OrderFulfillment.vue';
import ActivityLog from '~/components/operations/ActivityLog.vue';
import OperationsModals from '~/components/operations/OperationsModals.vue';

const authStore = useAuthStore();
const alertStore = useAlertStore();
const auditStore = useAuditStore();
const currentTab = ref('stock');

const availableTabs = computed(() => {
  const tabs = [
    { id: 'users', label: 'Create User & Team', badge: usersList.value.length.toString() },
    { id: 'items', label: 'Create Product', badge: catalogItems.value.length.toString() },
    { id: 'stock', label: 'Stock & Restock', badge: null },
    { id: 'history-stock', label: 'Stock History Ledger', badge: null },
    { id: 'orders', label: 'Accept Orders', badge: ordersQueue.value.filter(o => o.status === 'PENDING').length.toString() },
  ];
  if (authStore.isAdmin) {
    tabs.push({ id: 'activity', label: 'Cashier/Owner Audit Log', badge: 'Admin Only' });
  }
  return tabs;
});

// Users State
const usersList = ref([
  { id: 'u-1', fullName: 'Alexander Wright', email: 'owner@biolabs.com', role: 'OWNER', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'u-2', fullName: 'Marcus Vance', email: 'admin@biolabs.com', role: 'ADMIN', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'u-3', fullName: 'Sarah Chen', email: 'cashier@biolabs.com', role: 'CASHIER', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: 'u-4', fullName: 'Elena Rostova', email: 'customer@client.com', role: 'CUSTOMER', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
]);

// Products State
const catalogItems = ref([
  { name: 'Epithalon 20mg Peptide Vial', sku: 'PEP-EPI-20', barcode: '8934500109', price: 75.00, stock: 120, category: 'Precision Peptides', spec: '20mg Lyophilized', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
  { name: 'BPC-157 5mg Vial', sku: 'PEP-BPC-05', barcode: '8934500101', price: 48.00, stock: 85, category: 'Precision Peptides', spec: '5mg Lyophilized', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
  { name: 'GHK-Cu 50mg Tripeptide', sku: 'PEP-GHK-50', barcode: '8934500103', price: 62.00, stock: 24, category: 'Precision Peptides', spec: '50mg Pure Copper', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
  { name: 'TB-500 10mg Vial', sku: 'PEP-TB5-10', barcode: '8934500102', price: 58.00, stock: 40, category: 'Precision Peptides', spec: '10mg Thymosin Beta-4', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
  { name: 'Structured Lab Oversized Tee', sku: 'APP-TEE-01', barcode: '8934500104', price: 95.00, stock: 110, category: 'Editorial Apparel', spec: '320 GSM French Terry', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
  { name: 'Minimalist Research Lab Coat', sku: 'APP-COAT-01', barcode: '8934500105', price: 210.00, stock: 35, category: 'Editorial Apparel', spec: 'Bonded Poplin Wool', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80' },
]);

// Stock History Logs from global store
const stockHistoryLogs = computed(() => auditStore.stockHistory);

// Orders Queue
const ordersQueue = ref([
  { id: 'ORD-9842', source: 'WEB_STORE', customer: 'Elena Rostova', email: 'elena@client.com', totalAmount: 185.00, status: 'PENDING', createdAt: '10 mins ago', itemsSummary: '2x Epithalon 20mg, 1x Research Cap' },
  { id: 'ORD-9841', source: 'POS', customer: 'Walk-in Client', email: 'in-store-guest@biolabs.com', totalAmount: 96.00, status: 'ACCEPTED', createdAt: '28 mins ago', itemsSummary: '2x BPC-157 5mg Vial' },
  { id: 'ORD-9840', source: 'WEB_STORE', customer: 'David Kim', email: 'dkim@medtech.io', totalAmount: 210.00, status: 'COMPLETED', createdAt: '1 hour ago', itemsSummary: '1x Minimalist Research Lab Coat' },
]);

// Activity Logs from global store
const activityLogs = computed(() => auditStore.logs);

// Modals State
const showEditUserModal = ref(false);
const activeEditUser = ref({ id: '', fullName: '', email: '', role: 'CASHIER' });

const showEditItemModal = ref(false);
const activeEditItem = ref({ sku: '', name: '', price: 0, stock: 0, spec: '', imageUrl: '' });

function handleCreateUser(payload: any) {
  usersList.value.unshift({
    id: `u-${Date.now()}`,
    fullName: payload.fullName,
    email: payload.email,
    role: payload.role,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  });
  activityLogs.value.unshift({
    id: `act-${Date.now()}`,
    actorName: authStore.user?.fullName || 'Current User',
    role: authStore.currentRole || 'ADMIN',
    actionDescription: `Provisioned new user account: ${payload.fullName} (${payload.role})`,
    timeAgo: 'Just now',
    meta: `Email: ${payload.email}`,
  });
}

function openEditUser(user: any) {
  activeEditUser.value = { ...user };
  showEditUserModal.value = true;
}

function saveUserEdit() {
  const target = usersList.value.find(u => u.id === activeEditUser.value.id);
  if (target) {
    target.fullName = activeEditUser.value.fullName;
    target.email = activeEditUser.value.email;
    target.role = activeEditUser.value.role;
    activityLogs.value.unshift({
      id: `act-${Date.now()}`,
      actorName: authStore.user?.fullName || 'Store Owner',
      role: authStore.currentRole || 'OWNER',
      actionDescription: `Updated user profile and privileges for ${target.fullName} (${target.role})`,
      timeAgo: 'Just now',
      meta: `ID: ${target.id}`,
    });
  }
  showEditUserModal.value = false;
}

async function deleteUser(id: string) {
  const target = usersList.value.find(u => u.id === id);
  const confirmed = await alertStore.confirm({
    title: 'De-provision User',
    message: `Are you sure you want to remove user "${target?.fullName || id}"? All assigned privileges will be permanently revoked.`,
    type: 'danger',
    confirmText: 'Remove User',
  });

  if (confirmed) {
    usersList.value = usersList.value.filter(u => u.id !== id);
    activityLogs.value.unshift({
      id: `act-${Date.now()}`,
      actorName: authStore.user?.fullName || 'Store Owner',
      role: authStore.currentRole || 'OWNER',
      actionDescription: `De-provisioned user account ID: ${id}`,
      timeAgo: 'Just now',
      meta: 'RBAC Revocation',
    });
    alertStore.success(`User ${target?.fullName || id} has been successfully de-provisioned.`, 'User Removed');
  }
}

function handleCreateItem(payload: any) {
  catalogItems.value.unshift({ ...payload });
  activityLogs.value.unshift({
    id: `act-${Date.now()}`,
    actorName: authStore.user?.fullName || 'Store Owner',
    role: authStore.currentRole || 'OWNER',
    actionDescription: `Created new catalog product: ${payload.name} (SKU: ${payload.sku})`,
    timeAgo: 'Just now',
    meta: `Price: $${payload.price} • Stock: ${payload.stock}`,
  });
}

function openEditItem(item: any) {
  activeEditItem.value = { ...item };
  showEditItemModal.value = true;
}

function saveItemEdits() {
  const target = catalogItems.value.find(i => i.sku === activeEditItem.value.sku);
  if (target) {
    target.name = activeEditItem.value.name;
    target.price = activeEditItem.value.price;
    target.stock = activeEditItem.value.stock;
    target.spec = activeEditItem.value.spec;
    target.imageUrl = activeEditItem.value.imageUrl;
    activityLogs.value.unshift({
      id: `act-${Date.now()}`,
      actorName: authStore.user?.fullName || 'Store Owner',
      role: authStore.currentRole || 'OWNER',
      actionDescription: `Updated product ${target.name} (SKU: ${target.sku}) specs and price to $${target.price.toFixed(2)}`,
      timeAgo: 'Just now',
      meta: `Stock: ${target.stock}`,
    });
  }
  showEditItemModal.value = false;
}

function adjustStock(item: any, delta: number) {
  item.stock = Math.max(0, item.stock + delta);
  auditStore.recordStockMovement({
    productName: item.name,
    sku: item.sku,
    type: delta >= 0 ? 'RESTOCK' : 'ADJUSTMENT',
    delta,
    user: authStore.user?.fullName || 'Store Owner',
    balanceAfter: item.stock,
  });
  alertStore.success(`Restocked ${delta > 0 ? '+' + delta : delta} units of ${item.name}. New shelf balance: ${item.stock}`, 'Stock Updated');
}

function setStockDirect(item: any, newStock: number) {
  const previous = item.stock;
  const delta = newStock - previous;
  item.stock = Math.max(0, newStock);
  auditStore.recordStockMovement({
    productName: item.name,
    sku: item.sku,
    type: 'MANUAL_OVERRIDE',
    delta,
    user: authStore.user?.fullName || 'Store Owner',
    balanceAfter: item.stock,
  });
  alertStore.success(`Stock balance for ${item.name} updated to ${item.stock} units.`, 'Stock Adjusted');
}

function updateOrderStatus(orderId: string, newStatus: string) {
  const ord = ordersQueue.value.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    activityLogs.value.unshift({
      id: `act-${Date.now()}`,
      actorName: authStore.user?.fullName || 'Cashier Terminal',
      role: authStore.currentRole || 'CASHIER',
      actionDescription: `Updated order status for ${ord.id} to ${newStatus}`,
      timeAgo: 'Just now',
      meta: `Total: $${ord.totalAmount.toFixed(2)}`,
    });
  }
}
</script>
