import { useModalStore } from '@/stores/modalStore';
import { ModalConfig } from '@/stores/modalStore';

export type UseModalProps<T extends Record<string, unknown>> = ModalConfig<T>;

export const useModal = <T extends Record<string, unknown>>(props: UseModalProps<T>) => {
  const { id } = props;

  const openedModal = useModalStore((state) => state.actions.openedModal);
  const openModal = useModalStore((state) => state.actions.openModal);
  const closeModal = useModalStore((state) => state.actions.closeModal);
  const closeAllModals = useModalStore((state) => state.actions.closeAllModals);

  const handleOpenModal = () => {
    openModal<T>(props);
  };

  const handleCloseModal = () => {
    closeModal(id);
  };

  // TODO: 정말 필요한가?
  const isOpen = openedModal(id);

  return { isOpen, openModal: handleOpenModal, closeModal: handleCloseModal, closeAllModals };
};
