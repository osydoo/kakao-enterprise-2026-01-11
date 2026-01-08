import { type StateCreator as _StateCreator, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { StoreApi, UseBoundStore } from 'zustand';

type Middlewares = [['zustand/devtools', never], ['zustand/immer', never]];

type Initializer<T> = _StateCreator<T, Middlewares>;

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => unknown>)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const createStore = <T extends object>(initializer: Initializer<T>) =>
  create<T, Middlewares>(
    devtools(immer(initializer), {
      serialize: {
        options: {
          map: true,
        },
      },
    }),
  );
