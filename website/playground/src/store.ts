import { message } from 'antd';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { ExampleKey } from './data/example';
import { findExampleByKey } from './data/example';

interface Store {
  activatedTab: ExampleKey | null;
  zenCode: string;

  setActivatedTab: (tab: string) => void;
  setZenCode: (code: string) => void;
}

export const useGlobalStore = create(
  subscribeWithSelector(
    persist(
      immer<Store>(set => ({
        //#region  //*=========== state ===========
        activatedTab: null,
        isFirstVisit: true,
        zenCode: '',
        //#endregion  //*======== state ===========
        //#region  //*=========== actions ===========
        setActivatedTab: (tab: string) =>
          set(state => {
            state.activatedTab = tab;
          }),
        setZenCode: (code: string) =>
          set(state => {
            state.zenCode = code;
          })

        //#endregion  //*======== actions ===========
      })),
      {
        name: 'global-store',
        partialize: state => {
          return {
            activatedTab: state.activatedTab,
            zenCode: state.zenCode
          };
        }
      }
    )
  )
);

useGlobalStore.subscribe(
  state => state.activatedTab,
  activatedTab => {
    if (!activatedTab) return;

    const example = findExampleByKey(activatedTab);

    if (example) {
      useGlobalStore.getState().setZenCode(example.zenCode);
    } else {
      message.warning('Corresponding sample code not found.');
    }
  },
  { fireImmediately: true }
);
