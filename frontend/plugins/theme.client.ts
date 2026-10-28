import { io } from 'socket.io-client';
import { useThemeStore } from '~/stores/theme';

export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore();
  const config = useRuntimeConfig();

  // 1. Immediately apply cached theme so UI renders instantly with zero blocking
  themeStore.loadCachedTheme();

  const rawUrl = (config.public.backendUrl as string) || '';
  const backendUrl = rawUrl.replace(/\/+$/, '');

  // Skip connecting to localhost:3001 if browsing on an HTTPS deployed domain (prevents Mixed Content freeze)
  if (
    process.client &&
    window.location.protocol === 'https:' &&
    backendUrl.includes('localhost')
  ) {
    return;
  }

  if (backendUrl) {
    // 2. Non-blocking background fetch for live theme
    $fetch<any>(`${backendUrl}/api/settings`, { timeout: 3000 })
      .then((data) => {
        if (data) {
          themeStore.applyTheme(data);
        }
      })
      .catch(() => {
        // Fallback silently if backend is not yet deployed
      });

    // 3. Non-blocking WebSocket listener
    try {
      const socket = io(backendUrl, {
        autoConnect: true,
        reconnectionAttempts: 2,
        timeout: 3000,
      });

      socket.on('theme:updated', (newTheme) => {
        themeStore.applyTheme(newTheme);
      });
    } catch {
      // ignore websocket errors
    }
  }
});
