'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useBoardLoadingStore } from '@/stores/boardLoadingStore';

interface SearchBarProps {
  defaultValue: string;
}

export function SearchBar({ defaultValue }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setLoading = useBoardLoadingStore((state) => state.actions.setLoading);

  const handleSearch = (keyword: string, method: 'enter' | 'button') => {
    if (method === 'enter' || method === 'button') {
      const params = new URLSearchParams(searchParams.toString());
      if (keyword.trim()) {
        params.set('search', keyword.trim());
      } else {
        params.delete('search');
      }
      params.set('page', '1');

      // 로딩 상태 시작
      setLoading(true);

      // URL 업데이트하여 서버에서 새로운 데이터를 가져옴 (SSR)
      router.push(`/board?${params.toString()}`);
    }
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = e.currentTarget.value;
      handleSearch(keyword, 'enter');
    }
  };

  const handleSearchButtonClick = () => {
    const input = document.querySelector<HTMLInputElement>('input[type="text"][name="search"]');
    if (input) {
      handleSearch(input.value, 'button');
    }
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        type="text"
        name="search"
        placeholder="검색"
        aria-label="검색"
        defaultValue={defaultValue}
        onKeyDown={handleSearchInputKeyDown}
        className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
      />
      <button
        type="button"
        onClick={handleSearchButtonClick}
        aria-label="검색 실행"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        검색
      </button>
    </div>
  );
}
