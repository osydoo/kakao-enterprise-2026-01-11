import { useModalStore } from '@/stores/modalStore';
import { ModalConfig } from '@/stores/modalStore';

export type UseModalProps = ModalConfig;

export const useModal = (props: UseModalProps) => {
  const { id } = props;

  const openedModal = useModalStore((state) => state.openedModal);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const closeAllModals = useModalStore((state) => state.closeAllModals);

  const handleOpenModal = () => {
    openModal(props);
  };

  const handleCloseModal = () => {
    closeModal(id);
  };

  // TODO: 정말 필요한가?
  const isOpen = openedModal(id);

  return { isOpen, openModal: handleOpenModal, closeModal: handleCloseModal, closeAllModals };
};
