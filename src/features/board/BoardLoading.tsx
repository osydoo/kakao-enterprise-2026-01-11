'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useBoardLoadingStore } from '@/stores/boardLoadingStore';

export function BoardLoading() {
  const isLoading = useBoardLoadingStore((state) => state.isLoading);
  const setLoading = useBoardLoadingStore((state) => state.actions.setLoading);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL이 변경되면 로딩 상태 해제
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams, setLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-black/50"
    >
      <div className="rounded-lg bg-white px-6 py-4 shadow-lg dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">로딩 중...</div>
        </div>
      </div>
    </div>
  );
}
