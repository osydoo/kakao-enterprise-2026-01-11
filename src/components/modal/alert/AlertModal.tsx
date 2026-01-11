import { ModalConfig, useModalStore } from '@/stores/modalStore';
import { MODAL_ID } from '../modal.constants';
import Modal from '../Modal';

export interface AlertModalProps {
  title: string;
  message: string;
}

export const AlertModal = (props: AlertModalProps) => {
  const { title, message } = props;
  const closeModal = useModalStore((state) => state.actions.closeModal);

  return (
    <Modal>
      <Modal.Header title={title} />
      <Modal.Content>
        <p>{message}</p>
      </Modal.Content>
      <Modal.Footer>
        <button onClick={() => closeModal(MODAL_ID.ALERT)}>확인</button>
      </Modal.Footer>
    </Modal>
  );
};

const ALERT_MODAL: ModalConfig<AlertModalProps> = {
  id: MODAL_ID.ALERT,
  Component: AlertModal,
};
export default ALERT_MODAL;
