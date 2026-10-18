import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Intercept all outgoing $fetch requests to automatically attach role clearance headers
  const originalFetch = globalThis.$fetch;
  globalThis.$fetch = originalFetch.create({
    onRequest({ options }) {
      const headers = new Headers(options.headers || {});
      if (authStore.token) {
        headers.set('Authorization', `Bearer ${authStore.token}`);
      }
      if (authStore.currentRole) {
        headers.set('x-user-role', authStore.currentRole);
      }
      if (authStore.user?.fullName) {
        headers.set('x-user-name', authStore.user.fullName);
      }
      options.headers = headers;
    },
  });
});
