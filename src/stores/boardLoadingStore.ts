'use client';

import { createStore } from './store.util';
import { type Store } from './store.type';

type BoardLoadingState = {
  isLoading: boolean;
};

type BoardLoadingActions = {
  setLoading: (loading: boolean) => void;
};

const initialState: BoardLoadingState = {
  isLoading: false,
};

export const useBoardLoadingStore = createStore<Store<BoardLoadingState, BoardLoadingActions>>((set) => ({
  ...initialState,
  actions: {
    setLoading: (loading: boolean) => {
      set((s) => {
        s.isLoading = loading;
      });
    },
  },
}));
