'use client';

import type { ButtonHTMLAttributes } from 'react';
import { getPageNumberList } from './utils';
import type { Pagination } from './pagination.types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface PaginationProps {
  pagination: Pagination;
  disabled?: boolean;
  className?: string;
  visibleSize?: number;
  onPageChange?: (page: Pagination) => void;
}

const baseButtonClass =
  'min-w-9 h-9 inline-flex items-center justify-center rounded-md text-sm transition-colors select-none';

function PageButton({ isActive, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { isActive: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled}
      className={[
        baseButtonClass,
        !disabled ? 'cursor-pointer' : '',
        isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-100',
        'border border-gray-200',
        disabled ? 'opacity-50 cursor-not-allowed hover:bg-white' : '',
        props.className ?? '',
      ].join(' ')}
    />
  );
}

function Ellipsis() {
  return (
    <span
      aria-hidden="true"
      className="min-w-9 h-9 inline-flex items-center justify-center rounded-md  text-sm transition-colors text-gray-500 border border-gray-200"
    >
      ...
    </span>
  );
}

export default function Pagination({
  pagination,
  visibleSize = 7,
  className = '',
  disabled = false,
  onPageChange,
}: PaginationProps) {
  const page = Math.max(1, Math.min(pagination.currentPage, pagination.totalPage));
  const items = getPageNumberList(pagination.currentPage, pagination.totalPage, visibleSize);

  const disabledPrev = disabled || pagination.currentPage <= 1;
  const disabledNext = disabled || pagination.currentPage >= pagination.totalPage;

  return (
    <nav aria-label="Pagination" className={['flex items-center gap-2', className].join(' ')}>
      <PageButton
        aria-label="Previous page"
        isActive={false}
        disabled={disabledPrev}
        onClick={() => onPageChange?.({ ...pagination, currentPage: page - 1 })}
      >
        <ChevronLeftIcon size={16} />
      </PageButton>

      <div className="flex items-center gap-1">
        {items.map((item, idx) => {
          if (item === 'ellipsis') {
            return <Ellipsis key={`ellipsis-${idx}`} />;
          }

          const isActive = item === page;
          return (
            <PageButton
              key={item}
              aria-label={`Page ${item}`}
              aria-current={isActive ? 'page' : undefined}
              isActive={isActive}
              disabled={disabled}
              onClick={() => (isActive ? undefined : onPageChange?.({ ...pagination, currentPage: item }))}
            >
              {item}
            </PageButton>
          );
        })}
      </div>

      <PageButton
        aria-label="Next page"
        isActive={false}
        disabled={disabledNext}
        onClick={() => onPageChange?.({ ...pagination, currentPage: page + 1 })}
      >
        <ChevronRightIcon size={16} />
      </PageButton>
    </nav>
  );
}
