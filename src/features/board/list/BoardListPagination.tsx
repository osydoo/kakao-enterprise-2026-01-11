'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/pagination/Pagination';
import type { Pagination as PaginationType } from '@/components/pagination/pagination.types';
import { useBoardLoadingStore } from '@/stores/boardLoadingStore';

interface BoardListPaginationProps {
  pagination: PaginationType;
}

export function BoardListPagination({ pagination }: BoardListPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setLoading = useBoardLoadingStore((state) => state.actions.setLoading);

  const handlePageChange = (newPagination: PaginationType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPagination.currentPage.toString());

    // 로딩 상태 시작
    setLoading(true);

    // URL 업데이트하여 서버에서 새로운 데이터를 가져옴 (SSR)
    router.push(`/board?${params.toString()}`);
  };

  return (
    <div className="mt-4 flex justify-center">
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}
