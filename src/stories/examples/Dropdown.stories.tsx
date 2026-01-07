'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Dropdown, type DropdownItem } from '@/components/dropdown';

type Fruit = 'apple' | 'banana' | 'orange';

const items: Array<DropdownItem<Fruit>> = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

const DropdownDemo = () => {
  const [value, setValue] = useState<Fruit>('apple');

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 flex flex-col gap-3">
      <div className="text-sm text-gray-700">
        선택값: <span className="font-semibold">{value}</span>
      </div>
      <Dropdown<Fruit>
        items={items}
        value={value}
        onChange={(next) => {
          setValue(next);
        }}
      />
    </div>
  );
};

const meta: Meta<typeof DropdownDemo> = {
  title: 'Examples/Dropdown',
  component: DropdownDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'useState로 value를 제어하는 “controlled” 사용 예시입니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  parameters: {
    docs: { description: { story: '아이템 선택 시 상단 선택값 텍스트가 변경됩니다.' } },
  },
  play: async () => {
    await expect(screen.getByText(/선택값:/)).toHaveTextContent('apple');

    const trigger = screen.getByRole('button', { name: 'Apple' });
    await userEvent.click(trigger);

    const menu = screen.getByRole('menu');
    const scope = within(menu);
    await userEvent.click(scope.getByRole('menuitemradio', { name: 'Orange' }));

    await expect(screen.getByText(/선택값:/)).toHaveTextContent('orange');
  },
};
