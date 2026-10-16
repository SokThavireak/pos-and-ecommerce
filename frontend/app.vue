<template>
  <div class="min-h-screen flex flex-col bg-[#fcfcfc] text-[#141414] antialiased selection:bg-[var(--color-primary)] selection:text-white">
    <NuxtPage />
    <UiNotificationHost />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/theme';
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.loadCachedTheme();
  themeStore.applyTheme({});
});
</script>
