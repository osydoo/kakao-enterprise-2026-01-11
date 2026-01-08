'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dropdown } from '@/components/dropdown';
import { VIEW_TYPE, type ViewType } from '../../stores/viewTypeStore';
import { useViewType } from './useViewType';

type Props = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: Props) {
  const pathname = usePathname();

  const isHomeActive = pathname === '/';
  const isBoardActive = pathname.startsWith('/board');

  const { viewType, setViewType } = useViewType();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="font-semibold">대시보드</div>
        <div className="flex items-center gap-3">
          <Dropdown<ViewType>
            align="right"
            placeholder="보기 타입"
            value={viewType}
            items={[
              { value: VIEW_TYPE.LIST, label: '리스트 보기' },
              { value: VIEW_TYPE.CARD, label: '카드 보기' },
            ]}
            buttonClassName="min-w-0 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:focus:ring-zinc-800"
            menuClassName="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            onChange={(next) => {
              setViewType(next);
            }}
          />
        </div>
      </header>

      <aside className="fixed top-14 bottom-0 left-0 z-40 w-60 border-r border-zinc-200 bg-white px-3 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            aria-current={isHomeActive ? 'page' : undefined}
            className={[
              'rounded-md px-3 py-2 text-sm font-medium transition',
              isHomeActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900',
            ].join(' ')}
          >
            홈
          </Link>

          <Link
            href="/board"
            aria-current={isBoardActive ? 'page' : undefined}
            className={[
              'rounded-md px-3 py-2 text-sm font-medium transition',
              isBoardActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900',
            ].join(' ')}
          >
            서비스게시판
          </Link>
        </nav>
      </aside>

      <main className="fixed top-14 right-0 bottom-0 left-60 overflow-auto bg-zinc-50 p-6 dark:bg-black">
        {children}
      </main>
    </>
  );
}
