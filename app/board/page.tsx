import { getIssues, getIssuesCount, type Issue } from '@/shared/github';
import type { Pagination as PaginationType } from '@/components/pagination/pagination.types';
import Link from 'next/link';
import { SearchBar } from '@/features/board/list/SearchBar';
import { BoardListContent } from '@/features/board/list/BoardListContent';
import { BoardListPagination } from '@/features/board/list/BoardListPagination';

const PAGE_SIZE = 10;

interface BoardPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';

  let issues: Issue[] = [];
  let totalCount = 0;
  let error: string | null = null;

  try {
    const [issuesData, count] = await Promise.all([
      getIssues({ page, per_page: PAGE_SIZE, search }),
      getIssuesCount(search),
    ]);

    issues = issuesData;
    totalCount = count;
  } catch (err) {
    error = '게시글을 불러오는 중 오류가 발생했습니다.';
    console.error(err);
  }

  const totalPage = Math.ceil(totalCount / PAGE_SIZE);
  const pagination: PaginationType = {
    currentPage: page,
    pageSize: PAGE_SIZE,
    totalCount,
    totalPage,
  };

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

      <SearchBar defaultValue={search} />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          {error}
        </div>
      )}

      <BoardListContent issues={issues} />
      <BoardListPagination pagination={pagination} />
    </div>
  );
}
