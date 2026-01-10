'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import Dropdown from '@/components/dropdown/Dropdown';
import { useModal } from '@/hooks/useModal';
import DELETE_ISSUE_MODAL from '@/components/modal/DeleteIssueModal/DeleteIssueModal';
import { formatDate } from '@/utils/date';
import { Issue } from '@/shared/github';

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

const CardView = ({ list }: { list: Issue[] }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {list.map((item: Issue) => (
          <CardItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

function CardItem({ item }: { item: Issue }) {
  const router = useRouter();
  const { openModal } = useModal({
    ...DELETE_ISSUE_MODAL,
    props: {
      issueNumber: item.number,
    },
  });

  const handleDropdownChange = (value: string | number) => {
    if (value === 'edit') {
      router.push(`/board/${item.number}/edit`);
    } else if (value === 'delete') {
      openModal();
    }
  };

  const createdDate = formatDate(item.created_at);

  return (
    <article
      role="article"
      className="rounded-lg border border-zinc-200 bg-white p-4 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <Link
          href={`/board/${item.number}`}
          className="flex-1 font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          aria-label={`${item.title} 게시글 상세 보기`}
        >
          {item.title}
        </Link>
        <Dropdown
          items={dropdownItems}
          customTrigger={(props) => (
            <button
              {...props}
              type="button"
              aria-label="더보기"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <MoreHorizontal size={16} />
            </button>
          )}
          onChange={handleDropdownChange}
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span>{item.user.login}</span>
        <span className="text-zinc-400 dark:text-zinc-500">·</span>
        <span>{createdDate}</span>
      </div>
    </article>
  );
}

export default CardView;
