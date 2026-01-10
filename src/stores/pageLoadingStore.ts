'use client';

import { createStore } from './store.util';
import { type Store } from './store.type';

type PageLoadingState = {
  isLoading: boolean;
};

type PageLoadingActions = {
  setLoading: (loading: boolean) => void;
};

const initialState: PageLoadingState = {
  isLoading: false,
};

export const usePageLoadingStore = createStore<Store<PageLoadingState, PageLoadingActions>>((set) => ({
  ...initialState,
  actions: {
    setLoading: (loading: boolean) => {
      set((s) => {
        s.isLoading = loading;
      });
    },
  },
}));
