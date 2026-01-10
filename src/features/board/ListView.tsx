import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModal';
import { formatDate } from '@/utils/date';
import type { Issue } from '@/shared/github.types';
import Dropdown from '@/components/dropdown/Dropdown';
import DELETE_ISSUE_MODAL from '@/components/modal/deleteIssueModal/DeleteIssueModal';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

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

function ListView({ list }: { list: Issue[] }) {
  return (
    <table role="table" className="w-full">
      <colgroup>
        <col width="64px" />
        <col width="40%" />
        <col width="20%" />
        <col width="20%" />
        <col width="64px" />
      </colgroup>
      <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <tr>
          <th className="px-4 py-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">번호</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100">타이틀</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100">작성자</th>
          <th className="px-4 py-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">등록일시</th>
          <th className="px-4 py-3 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100"></th>
        </tr>
      </thead>
      <tbody>
        {list.map((item: Issue) => (
          <ListItem key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  );
}

function ListItem({ item }: { item: Issue }) {
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
    <tr role="row" className="border-b border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
      <td className="px-4 py-3 text-center text-sm text-zinc-900 dark:text-zinc-100">{item.number}</td>
      <td className="px-4 py-3">
        <Link
          href={`/board/${item.number}`}
          className="font-sm text-zinc-900 hover:underline dark:text-zinc-100"
          aria-label={`${item.title} 게시글 상세 보기`}
        >
          {item.title}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{item.user.login}</td>
      <td className="px-4 py-3 text-center text-sm text-zinc-600 dark:text-zinc-400">{createdDate}</td>
      <td className="px-4 py-3 text-center align-middle">
        <Dropdown
          items={dropdownItems}
          customTrigger={(props) => (
            <button
              {...props}
              type="button"
              aria-label="더보기"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <MoreHorizontal size={16} />
            </button>
          )}
          onChange={handleDropdownChange}
        />
      </td>
    </tr>
  );
}

export default ListView;
