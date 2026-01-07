import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, within } from 'storybook/test';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Dropdown } from '@/components/dropdown';

type DropdownArgs = Omit<ComponentProps<typeof Dropdown>, 'value' | 'onChange'>;

const DropdownControlled = (args: DropdownArgs) => {
  const [value, setValue] = useState<string | number | undefined>(undefined);

  return (
    <Dropdown
      {...args}
      value={value}
      onChange={(next) => {
        setValue(next);
      }}
    />
  );
};

const meta: Meta<typeof DropdownControlled> = {
  title: 'Components/Dropdown',
  component: DropdownControlled,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 드롭다운 컴포넌트입니다. 바깥 클릭/ESC 닫기, 방향키 이동, Enter/Space 선택을 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: '선택해주세요',
    items: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ],
  },
  parameters: {
    docs: { description: { story: '기본 렌더링 및 클릭 선택 동작을 확인합니다.' } },
  },
  play: async () => {
    const trigger = screen.getByRole('button', { name: /선택해주세요/i });
    await userEvent.click(trigger);

    const menu = screen.getByRole('menu');
    const scope = within(menu);
    await expect(scope.getByRole('menuitemradio', { name: 'Banana' })).toBeVisible();

    await userEvent.click(scope.getByRole('menuitemradio', { name: 'Banana' }));
    await expect(screen.getByRole('button', { name: 'Banana' })).toBeVisible();
    await expect(screen.queryByRole('menu')).toBeNull();
  },
};
