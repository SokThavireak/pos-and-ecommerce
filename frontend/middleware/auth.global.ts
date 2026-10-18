import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useAuditStore } from '~/stores/audit';

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
      try {
        const auditStore = useAuditStore();
        auditStore.recordActivity({
          actorName: authStore.user?.fullName || 'Customer',
          role: 'CUSTOMER',
          category: 'SECURITY_EVENT',
          actionDescription: `BLOCKED unauthorized client attempt to access admin dashboard (${to.fullPath})`,
          meta: `RBAC Violation • Diverted to /orders`,
          severity: 'critical',
        });
      } catch (e) {}
      return navigateTo('/orders');
    }

    // Cashiers are restricted to POS terminal only, blocked from admin settings & overview
    if (authStore.isCashier) {
      try {
        const auditStore = useAuditStore();
        auditStore.recordActivity({
          actorName: authStore.user?.fullName || 'Cashier',
          role: 'CASHIER',
          category: 'SECURITY_EVENT',
          actionDescription: `BLOCKED cashier from accessing admin hub (${to.fullPath})`,
          meta: `Diverted to /pos terminal`,
          severity: 'notice',
        });
      } catch (e) {}
      return navigateTo('/pos');
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
      try {
        const auditStore = useAuditStore();
        auditStore.recordActivity({
          actorName: authStore.user?.fullName || 'Customer',
          role: 'CUSTOMER',
          category: 'SECURITY_EVENT',
          actionDescription: `BLOCKED unauthorized attempt to access POS terminal`,
          meta: `Access Denied • Diverted to storefront`,
          severity: 'critical',
        });
      } catch (e) {}
      return navigateTo('/');
    }
  }
});
