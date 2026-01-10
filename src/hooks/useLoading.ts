import { usePageLoadingStore } from '@/stores/pageLoadingStore';

export function useLoading() {
  const isLoading = usePageLoadingStore((state) => state.isLoading);
  const openLoading = usePageLoadingStore((state) => state.actions.setLoading);
  const closeLoading = usePageLoadingStore((state) => state.actions.setLoading);

  return {
    isLoading,
    openLoading,
    closeLoading,
  };
}
