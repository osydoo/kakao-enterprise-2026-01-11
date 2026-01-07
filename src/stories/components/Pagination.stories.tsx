import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, within } from 'storybook/test';
import { Pagination } from '@/components/pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
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

export const Total7: Story = {
  args: { pagination: { currentPage: 1, pageSize: 10, totalCount: 100, totalPage: 7 } },
  parameters: {
    docs: { description: { story: '총 7페이지: 모든 페이지 번호를 표시합니다.' } },
  },
  play: async () => {
    const scope = within(screen.getByRole('navigation'));

    // 각 페이지 번호(1~7)가 존재하는지 확인
    for (let i = 1; i <= 7; i++) {
      const pageBtn = scope.getByRole('button', { name: `Page ${i}` });
      await expect(pageBtn).toBeVisible();
    }
    // 초기 페이지(1)가 활성화
    await expect(scope.getByRole('button', { name: `Page 1` })).toHaveClass('bg-gray-900 text-white');
  },
};
