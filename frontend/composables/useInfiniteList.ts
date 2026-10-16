import { ref, computed } from 'vue';

export function useInfiniteList<T>(allItemsSource: () => T[], pageSize = 6) {
  const displayLimit = ref(pageSize);
  const isLoadingMore = ref(false);

  const displayedItems = computed(() => {
    return allItemsSource().slice(0, displayLimit.value);
  });

  const hasMore = computed(() => {
    return displayLimit.value < allItemsSource().length;
  });

  async function loadMore() {
    if (isLoadingMore.value || !hasMore.value) return;
    isLoadingMore.value = true;
    // Micro-delay to simulate seamless chunked streaming & display skeleton/spinner
    await new Promise((resolve) => setTimeout(resolve, 400));
    displayLimit.value += pageSize;
    isLoadingMore.value = false;
  }

  function reset() {
    displayLimit.value = pageSize;
  }

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    displayLimit,
  };
}
