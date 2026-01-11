import { Store } from './store.type';
import { createStore } from './store.util';

export interface ModalConfig<T = Record<string, unknown>> {
  id: string;
  Component: React.FC<T>;
  callback?: () => void;
  props?: T;
}

interface ModalStoreState {
  modals: ModalConfig[];
}

interface ModalStoreAction {
  openModal: <T>(config: ModalConfig<T>) => void;
  closeModal: (id: string) => void;
  closeLastModal: () => void;
  closeAllModals: () => void;
  openedModal: (id: string) => boolean;
}

const initialState: ModalStoreState = {
  modals: [],
};

export const useModalStore = createStore<Store<ModalStoreState, ModalStoreAction>>((set, get) => ({
  ...initialState,
  actions: {
    openModal: <T>(config: ModalConfig<T>) => {
      set((state) => ({
        modals: [...state.modals, config],
      }));
    },
    closeModal: (id: string) => {
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
        if (modal.callback) {
          modal.callback();
        }
      });

      set({ modals: [] });
    },

    openedModal: (id: string) => {
      const { modals } = get();
      return modals.some((modal) => modal.id === id);
    },
  },
}));
