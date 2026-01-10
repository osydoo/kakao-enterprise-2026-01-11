'use client';

import ListView from './ListView';
import { useViewTypeStore } from '@/stores/viewTypeStore';
import CardView from './CardView';
import Pagination from '@/components/pagination/Pagination';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { useBoard } from './useBoard';

function BoardContent() {
  const viewType = useViewTypeStore((state) => state.viewType);
  const {
    issueQuery = {
      data: { issues: [], pagination: { currentPage: 1, pageSize: 10, totalCount: 0, totalPage: 0 } },
      isError: false,
      error: null,
      isPending: false,
      isSuccess: false,
    },
    search,
    pagination,
    handleChangePage,
    handleChangeSearch,
  } = useBoard();
  const list = issueQuery.data?.issues || [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">서비스 게시판</h1>
        <Link
          href="/board/create"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label="등록"
        >
          등록
        </Link>
      </div>
      <SearchBar value={search} onSearch={handleChangeSearch} />
      {issueQuery.isError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          {issueQuery.error?.message}
        </div>
      )}
      <section
        role="region"
        aria-label="게시글 목록"
        className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      >
        {viewType === 'list' && <ListView list={list} />}
        {viewType === 'card' && <CardView list={list} />}
        {issueQuery.isSuccess && issueQuery.data?.issues?.length === 0 && (
          <div className="p-8 text-center text-sm text-zinc-600 dark:text-zinc-400">등록된 게시글이 없습니다</div>
        )}
      </section>
      <div className="mt-4 flex justify-center">
        <Pagination
          pagination={{
            ...pagination,
            currentPage: pagination.currentPage,
            pageSize: pagination.pageSize,
            totalCount: issueQuery.data?.pagination?.totalCount || 0,
            totalPage: issueQuery.data?.pagination?.totalPage || 0,
          }}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
}

export default BoardContent;
