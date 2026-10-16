import { io } from 'socket.io-client';
import { useThemeStore } from '~/stores/theme';

export default defineNuxtPlugin(async () => {
  const themeStore = useThemeStore();
  const config = useRuntimeConfig();
  const backendUrl = config.public.backendUrl || 'http://localhost:3001';

  // 1. Initial Theme Settings Load
  try {
    const data = await $fetch<any>(`${backendUrl}/api/settings`);
    if (data) {
      themeStore.applyTheme(data);
    }
  } catch (err) {
    // If backend isn't up yet, fallback to default editorial theme variables
    themeStore.applyTheme({
      colorPrimary: '#d97757',
      colorSecondary: '#8b5cf6',
      colorSurface: '#fdf2ee',
      storeName: 'biolabs',
      logoUrl: '/logo.svg',
    });
  }

  // 2. Real-time WebSocket Gateway listener
  try {
    const socket = io(backendUrl, {
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    socket.on('theme:updated', (newTheme) => {
      themeStore.applyTheme(newTheme);
    });
  } catch (e) {
    console.warn('WebSocket connection not initialized', e);
  }
});
