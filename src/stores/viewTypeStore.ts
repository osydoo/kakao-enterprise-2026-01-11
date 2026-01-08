'use client';

import { createStore } from './store.util';
import { type Store } from './store.type';

export const VIEW_TYPE = {
  LIST: 'list',
  CARD: 'card',
} as const;

export type ViewType = (typeof VIEW_TYPE)[keyof typeof VIEW_TYPE];

type ViewTypeState = {
  viewType: ViewType;
};

type ViewTypeActions = {
  initialize: () => void;
  setViewType: (next: ViewType) => void;
};

const initialState: ViewTypeState = {
  viewType: VIEW_TYPE.LIST,
};

export const useViewTypeStore = createStore<Store<ViewTypeState, ViewTypeActions>>((set) => ({
  ...initialState,
  actions: {
    initialize: () => {
      if (typeof window === 'undefined') return;
      const viewType = (window.localStorage.getItem('viewType') as ViewType) ?? VIEW_TYPE.LIST;
      set((s) => {
        s.viewType = viewType;
      });
    },
    setViewType: (next: ViewType) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('viewType', next);
      }
      set((s) => {
        s.viewType = next;
      });
    },
  },
}));
