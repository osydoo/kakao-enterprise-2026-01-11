import type { Meta, StoryObj } from '@storybook/react';
import { screen, expect } from 'storybook/test';
import { Modal } from '@/components/modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '재사용 가능한 모달 컴포넌트입니다. Header, Content, Footer 서브 컴포넌트를 포함합니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <Modal>
        <Modal.Header title="기본 모달" onClose={() => {}} />
        <Modal.Content>
          <p>이것은 기본 모달입니다.</p>
        </Modal.Content>
        <Modal.Footer>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">확인</button>
        </Modal.Footer>
      </Modal>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 모달 구조를 보여줍니다.',
      },
    },
  },
  play: async () => {
    // 1. 타이틀이 정상적으로 표시되는지 확인
    const title = screen.getByRole('heading', { level: 2 });
    await expect(title).toBeInTheDocument();
    await expect(title).toHaveTextContent('기본 모달');

    // 2. 닫기 버튼(X)이 존재하는지 확인
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await expect(closeButton).toBeInTheDocument();

    // 3. 모달 컨텐츠가 정상적으로 표시되는지 확인
    const content = screen.getByText('이것은 기본 모달입니다.');
    await expect(content).toBeInTheDocument();

    // 4. 확인 버튼이 존재하는지 확인
    const confirmButton = screen.getByRole('button', { name: '확인' });
    await expect(confirmButton).toBeInTheDocument();
  },
};
