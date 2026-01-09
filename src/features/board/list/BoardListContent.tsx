'use client';

import Link from 'next/link';
import type { Issue } from '@/shared/github';
import { useViewTypeStore } from '@/stores/viewTypeStore';

interface BoardListContentProps {
  issues: Issue[];
}

export function BoardListContent({ issues }: BoardListContentProps) {
  const viewType = useViewTypeStore((state) => state.viewType);
  const isEmpty = issues.length === 0;

  return (
    <section
      role="region"
      aria-label="게시글 목록"
      className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      {viewType === 'list' ? (
        <table role="table" className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100">제목</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.id}
                role="row"
                className="border-b border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/board/${issue.number}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                  >
                    {issue.title}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <article
                key={issue.id}
                role="article"
                className="rounded-lg border border-zinc-200 bg-white p-4 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Link
                  href={`/board/${issue.number}`}
                  className="block font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                >
                  {issue.title}
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {isEmpty && (
        <div className="p-8 text-center text-sm text-zinc-600 dark:text-zinc-400">등록된 게시글이 없습니다</div>
      )}
    </section>
  );
}
