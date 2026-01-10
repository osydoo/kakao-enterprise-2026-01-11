'use client';

import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (search: string) => void;
}

export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [search, setSearch] = useState(value);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(search);
    }
  };

  const handleSearchButtonClick = () => {
    onSearch(search);
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        type="text"
        name="search"
        placeholder="검색"
        aria-label="검색"
        value={search}
        onChange={handleSearchInputChange}
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
