import Modal from '../Modal';
import { MODAL_ID } from '../modal.constants';
import { useModalStore } from '@/stores/modalStore';
import { ModalConfig } from '@/stores/modalStore';

export interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const { title, message, onConfirm } = props;
  const closeModal = useModalStore((state) => state.actions.closeModal);

  const handleConfirm = () => {
    onConfirm();
    closeModal(MODAL_ID.CONFIRM);
  };

  return (
    <Modal>
      <Modal.Header title={title} />
      <Modal.Content>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={() => closeModal(MODAL_ID.CONFIRM)}>취소</button>
        <button onClick={handleConfirm}>확인</button>
      </Modal.Footer>
    </Modal>
  );
};

const CONFIRM_MODAL: ModalConfig<ConfirmModalProps> = {
  id: MODAL_ID.CONFIRM,
  Component: ConfirmModal,
};

export default CONFIRM_MODAL;
