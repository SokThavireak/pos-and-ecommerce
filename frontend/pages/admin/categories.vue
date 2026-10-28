<template>
  <div class="h-screen bg-[#f4f5f7] p-4 sm:p-6 flex gap-6 antialiased overflow-hidden">
    <!-- Full-Height Floating Dark Sidebar -->
    <AdminSidebar />

    <!-- Main Workspace Container -->
    <main class="flex-1 flex flex-col h-full overflow-hidden space-y-6">
      <!-- Top Bar: Title & Access Indicator -->
      <header class="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs flex-shrink-0">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Category Taxonomy Management</h1>
            <span class="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              OWNER & ADMIN PRIVILEGES
            </span>
          </div>
          <p class="text-xs text-neutral-500 mt-0.5">
            Create, edit, and organize product categories synchronized live to POS terminals and Web Storefront.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin/items"
            class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5"
          >
            ← Back to Item Catalog
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
          >
            View in Storefront
          </NuxtLink>
        </div>
      </header>

      <!-- Main Workspace: Asymmetric 2-column layout (5 cols Form + 7 cols Table) -->
      <div class="flex-1 overflow-y-auto pr-1">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Category Creation Form (5 cols) -->
          <div class="lg:col-span-5">
            <CategoryForm @create-category="handleCreateCategory" />
          </div>

          <!-- Right Column: Category Table & List (7 cols) -->
          <div class="lg:col-span-7">
            <CategoryTable
              :categories="categories"
              @edit-category="openEditModal"
              @delete-category="handleDeleteCategory"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Edit Category Modal -->
    <CategoryModal
      :show="showModal"
      :category="activeEditCategory"
      @close="showModal = false"
      @save="saveCategoryEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAlertStore } from '~/stores/alert';
import AdminSidebar from '~/components/AdminSidebar.vue';
import CategoryForm from '~/components/categories/CategoryForm.vue';
import CategoryTable from '~/components/categories/CategoryTable.vue';
import CategoryModal from '~/components/categories/CategoryModal.vue';

const authStore = useAuthStore();
const alertStore = useAlertStore();

const categories = ref([
  {
    id: 'cat-1',
    name: 'Precision Peptides',
    slug: 'peptides',
    description: 'High-purity bio-active peptides, lyophilized research vials, and receptor ligands.',
    productCount: 14,
    tint: 'emerald',
  },
  {
    id: 'cat-2',
    name: 'Editorial Apparel',
    slug: 'apparel',
    description: 'Minimalist heavyweight garments, oversized lab coats, and bespoke cotton streetwear.',
    productCount: 8,
    tint: 'indigo',
  },
  {
    id: 'cat-3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Laboratory glassware, bacteriostatic water kits, precision micro-syringes, and vials.',
    productCount: 6,
    tint: 'amber',
  },
  {
    id: 'cat-4',
    name: 'Cellular Longevity',
    slug: 'cellular-longevity',
    description: 'Telomerase activators, epigenetic co-factors, and mitochondrial support complexes.',
    productCount: 5,
    tint: 'rose',
  },
]);

const showModal = ref(false);
const activeEditCategory = ref({
  id: '',
  name: '',
  slug: '',
  description: '',
  tint: 'emerald',
});

function handleCreateCategory(payload: any) {
  categories.value.unshift({
    id: `cat-${Date.now()}`,
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    productCount: 0,
    tint: payload.tint,
  });
}

function openEditModal(cat: any) {
  activeEditCategory.value = { ...cat };
  showModal.value = true;
}

function saveCategoryEdit() {
  const target = categories.value.find((c) => c.id === activeEditCategory.value.id);
  if (target) {
    target.name = activeEditCategory.value.name;
    target.slug = activeEditCategory.value.slug;
    target.description = activeEditCategory.value.description;
    target.tint = activeEditCategory.value.tint;
  }
  showModal.value = false;
}

async function handleDeleteCategory(id: string) {
  const cat = categories.value.find((c) => c.id === id);
  const confirmed = await alertStore.confirm({
    title: 'Delete Category',
    message: `Are you sure you want to delete category "${cat?.name || id}"? All product linkages to this category may be affected.`,
    type: 'danger',
    confirmText: 'Delete Category',
  });

  if (confirmed) {
    categories.value = categories.value.filter((c) => c.id !== id);
    alertStore.success(`Category "${cat?.name || id}" was successfully removed.`, 'Category Deleted');
  }
}
</script>
