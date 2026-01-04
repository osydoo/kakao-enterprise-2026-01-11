import { create } from 'zustand';

export interface ModalConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  Component: React.FC<T>;
  onClose?: () => void;
  props?: T;
}

interface ModalStore {
  modals: ModalConfig[];
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeLastModal: () => void;
  closeAllModals: () => void;
  openedModal: (id: string) => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],

  openModal: (config: ModalConfig) => {
    set((state) => ({
      modals: [...state.modals, config],
    }));
  },

  closeModal: (id: string) => {
    const { modals } = get();
    const modalToClose = modals.find((modal) => modal.id === id);

    if (modalToClose?.onClose) {
      modalToClose.onClose();
    }

    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },

  closeLastModal: () => {
    set((state) => ({
      modals: state.modals.slice(0, -1),
    }));
  },

  closeAllModals: () => {
    const { modals } = get();

    // 모든 모달의 onClose 콜백을 실행
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });

    set({ modals: [] });
  },

  openedModal: (id: string) => {
    const { modals } = get();
    return modals.some((modal) => modal.id === id);
  },
}));
