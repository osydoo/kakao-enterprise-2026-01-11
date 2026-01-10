'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoreVertical, Calendar, User, Hash } from 'lucide-react';
import Dropdown from '@/components/dropdown/Dropdown';
import { useModal } from '@/hooks/useModal';
import DELETE_ISSUE_MODAL from '@/components/modal/DeleteIssueModal/DeleteIssueModal';
import { formatDate } from '@/utils/date';
import type { Issue } from '@/shared/github';

interface BoardDetailContentProps {
  issue: Issue;
}

const dropdownItems = [
  {
    value: 'edit',
    label: '수정',
  },
  {
    value: 'delete',
    label: '삭제',
  },
];

export function BoardDetailContent({ issue }: BoardDetailContentProps) {
  const router = useRouter();
  const { openModal } = useModal({
    ...DELETE_ISSUE_MODAL,
    props: {
      issueNumber: issue.number,
    },
  });

  const handleDropdownChange = (value: string | number) => {
    if (value === 'edit') {
      router.push(`/board/${issue.number}/edit`);
    } else if (value === 'delete') {
      openModal();
    }
  };

  const createdDate = formatDate(issue.created_at);
  const updatedDate = formatDate(issue.updated_at);
  const isUpdated = issue.created_at !== issue.updated_at;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100" role="heading" aria-level={1}>
              {issue.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Hash size={14} />
                <span>#{issue.number}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{issue.user.login}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>작성일: {createdDate}</span>
              </div>
              {isUpdated && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>수정일: {updatedDate}</span>
                </div>
              )}
            </div>
          </div>
          <Dropdown
            items={dropdownItems}
            customTrigger={(props) => (
              <button
                {...props}
                type="button"
                aria-label="더보기"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <MoreVertical size={16} />
              </button>
            )}
            onChange={handleDropdownChange}
          />
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {issue.body ? (
            <div role="region" aria-label="내용" className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">
              {issue.body}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">내용이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 하단 액션 영역 */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">게시글 번호: #{issue.number}</div>
        <Link
          href="/board"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          목록
        </Link>
      </div>
    </div>
  );
}
