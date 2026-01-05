import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, screen } from 'storybook/test';
import { useModal } from '@/hooks/useModal';
import { ModalConfig } from '@/stores/modalStore';
import { Modal } from '@/components/modal';

// 테스트용 모달 설정들
const TEST_MODAL = 'test-modal';
const TEST_MODAL2 = 'test-modal2';

// 테스트 모달 버튼 컴포넌트
const TestModalButton = () => {
  const { openModal } = useModal(TestModalConfig);
  return (
    <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      모달 열기
    </button>
  );
};

// 테스트 모달 1
const TestModal = () => {
  const { closeModal } = useModal(TestModalConfig);
  const { openModal: openModal2 } = useModal(TestModal2Config);

  return (
    <Modal>
      <Modal.Header title="테스트 모달 1" onClose={closeModal} />
      <Modal.Content>
        <p>이것은 테스트 모달 1입니다.</p>
        <p>다른 모달을 열 수 있는 버튼이 있습니다.</p>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={openModal2} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          테스트 모달 2 열기
        </button>
        <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

// 테스트 모달 2
const TestModal2 = () => {
  const { closeModal, closeAllModals } = useModal(TestModal2Config);
  return (
    <Modal
      styles={{
        width: '768px',
        height: '500px',
      }}
    >
      <Modal.Header title="테스트 모달 2" onClose={closeModal} />
      <Modal.Content>
        <p>이것은 테스트 모달 2입니다.</p>
        <p>커스텀 스타일(768px × 500px)이 적용되어 있습니다.</p>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={closeAllModals} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          전체 닫기
        </button>
        <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

// 모달 설정들
const TestModalConfig: ModalConfig = {
  id: TEST_MODAL,
  Component: TestModal,
};

const TestModal2Config: ModalConfig = {
  id: TEST_MODAL2,
  Component: TestModal2,
};

const meta: Meta<typeof TestModalButton> = {
  title: 'Examples/Modal',
  component: TestModalButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Storybook에서만 사용되는 테스트 모달 컴포넌트들의 예시입니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenModal: Story = {
  parameters: {
    docs: {
      description: {
        story: '모달을 여는 버튼 컴포넌트입니다.',
      },
    },
  },
  play: async () => {
    // 1. 모달 열기 버튼 클릭 (canvasElement 내에서 찾기)
    const openButton = screen.getByText('모달 열기');
    await userEvent.click(openButton);

    // 2. 모달이 열릴 때까지 대기 (screen으로 전체 document에서 찾기)
    await screen.findByText('테스트 모달 1');

    // 3. 모달이 열렸는지 확인
    await expect(screen.getByText('테스트 모달 1')).toBeInTheDocument();

    // 4. 모달 2 열기 버튼 클릭
    const openButton2 = screen.getByText('테스트 모달 2 열기');
    await userEvent.click(openButton2);

    // 5. 모달 2가 열릴 때까지 대기
    await screen.findByText('테스트 모달 2');

    // 6. 모달 2가 열렸는지 확인
    await expect(screen.getByText('테스트 모달 2')).toBeInTheDocument();

    // 7. 전체 닫기 버튼 클릭 (모달 2의 버튼)
    const closeAllButton = screen.getByRole('button', { name: /전체 닫기/i });
    await userEvent.click(closeAllButton);
  },
};
