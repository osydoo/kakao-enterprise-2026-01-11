'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, screen, within } from 'storybook/test';
import { Pagination } from '@/components/pagination';

const PaginationDemo = ({ totalPages }: { totalPages: number }) => {
  const [page, setPage] = useState(1);

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <Pagination
        pagination={{ currentPage: page, pageSize: 10, totalCount: 100, totalPage: totalPages }}
        onPageChange={(pagination) => setPage(pagination.currentPage)}
      />
    </div>
  );
};

const meta: Meta<typeof PaginationDemo> = {
  title: 'Examples/Pagination',
  component: PaginationDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '최대 7개의 페이지 숫자를 표시하고, 필요 시 ...을 표시하는 Pagination 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Total10: Story = {
  args: { totalPages: 10 },
  parameters: {
    docs: { description: { story: '총 10페이지: 현재 페이지 위치에 따라 ...이 양쪽에 표시될 수 있습니다.' } },
  },
  play: async () => {
    // 1. 숫자 ... totalPages 가 노출되는지?
    const scope = within(screen.getByRole('navigation'));

    // 1, ..., 10이 보이는지 확인
    await expect(scope.getByRole('button', { name: 'Page 1' })).toBeVisible();
    await expect(scope.getByText('...')).toBeVisible();
    await expect(scope.getByRole('button', { name: 'Page 10' })).toBeVisible();

    // 2. 최초에 Previous page가 disabled인지?
    const prevBtn = scope.getByRole('button', { name: 'Previous page' });
    await expect(prevBtn).toBeDisabled();

    // 3. Next page버튼이 동작하는지?
    const nextBtn = scope.getByRole('button', { name: 'Next page' });
    await expect(nextBtn).not.toBeDisabled();

    // Next 클릭 -> 페이지 이동 (2)
    await nextBtn.click();
    // 2번이 활성화 되어야 함
    await expect(scope.getByRole('button', { name: 'Page 2' })).toHaveClass('bg-gray-900 text-white');
    // 이전 버튼은 활성화
    await expect(prevBtn).not.toBeDisabled();

    // 4. 5페이지까지 갔을때 좌 우로 ... 이 생기는지?
    // 2, 3, 4, 5 까지 next 버튼 클릭
    for (let i = 3; i <= 5; i++) {
      await scope.getByRole('button', { name: 'Next page' }).click();
      await expect(scope.getByRole('button', { name: `Page ${i}` })).toHaveClass('bg-gray-900 text-white');
    }
    // ...이 두 개 존재 (중간에)
    const ellipses = scope.getAllByText('...');
    await expect(ellipses.length).toBe(2);

    // 5. 마지막 페이지로 갔을때 1...totalPages가 노출되는지?
    // 6,7,8,9,10로 쭉 next 클릭
    for (let i = 6; i <= 10; i++) {
      await scope.getByRole('button', { name: 'Next page' }).click();
      await expect(scope.getByRole('button', { name: `Page ${i}` })).toHaveClass('bg-gray-900 text-white');
    }
    // 1, ... , 10만 보이는지 (즉, ...과 마지막 페이지가 유지되는지)
    await expect(scope.getByRole('button', { name: 'Page 1' })).toBeVisible();
    await expect(scope.getByText('...')).toBeVisible();
    await expect(scope.getByRole('button', { name: 'Page 10' })).toBeVisible();

    // 6. Next page 버튼이 disabled가 되는지?
    const finalNextBtn = scope.getByRole('button', { name: 'Next page' });
    await expect(finalNextBtn).toBeDisabled();
  },
};
