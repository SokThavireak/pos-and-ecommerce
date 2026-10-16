import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const path = to.path.toLowerCase();

  // 1. Guard all /admin routes
  if (path.startsWith('/admin')) {
    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo('/login');
    }

    // Customer role is strictly forbidden from entering staff/owner admin dashboards
    if (authStore.isCustomer) {
      return navigateTo('/orders');
    }

    // Brand studio / settings is reserved for ADMIN only
    if (path.startsWith('/admin/settings') && !authStore.isAdmin) {
      return navigateTo('/admin');
    }

    // Database backup & Audit is reserved for ADMIN only
    if ((path.startsWith('/admin/backup') || path.startsWith('/admin/audit')) && !authStore.isAdmin) {
      return navigateTo('/admin');
    }
  }

  // 2. Guard POS terminal: only STAFF (OWNER / CASHIER)
  if (path.startsWith('/pos')) {
    if (!authStore.isAuthenticated) {
      return navigateTo('/login');
    }
    if (!authStore.canAccessPOS) {
      return navigateTo('/');
    }
  }
});
