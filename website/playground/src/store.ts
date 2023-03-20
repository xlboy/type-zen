import { Compiler, Parser } from '@type-zen/core';
import { message } from 'antd';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { ExampleKey } from './data/example';
import { findExampleByKey } from './data/example';

type Monaco = typeof monaco;
interface Store {
  activatedTab: ExampleKey | null;
  zenCode: string;
  compiledCode: string;
  zenMonaco: Monaco | null;

  setActivatedTab: (tab: string) => void;
  setZenCode: (code: string) => void;
  setCompiledCode: (code: string) => void;
  setZenMonaco: (instance: Monaco) => void;
}

export const useGlobalStore = create(
  subscribeWithSelector(
    persist(
      immer<Store>(set => ({
        //#region  //*=========== state ===========
        activatedTab: null,
        zenCode: '',
        compiledCode: '',
        zenMonaco: null,
        //#endregion  //*======== state ===========
        //#region  //*=========== actions ===========
        setActivatedTab: (tab: string) =>
          set(state => {
            state.activatedTab = tab;
          }),
        setZenCode: (code: string) =>
          set(state => {
            state.zenCode = code;
          }),
        setCompiledCode: (code: string) =>
          set(state => {
            state.compiledCode = code;
          }),
        setZenMonaco: (instance: Monaco) =>
          set(state => {
            state.zenMonaco = instance;
          })

        //#endregion  //*======== actions ===========
      })),
      {
        name: 'global-store',
        partialize: state => {
          return {};
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

(function listeningZenCode() {
  type ErrorPosKey = `${/* line */ number}:${/* col */ number}`;
  const errorPosMap: Record<ErrorPosKey, /* msg */ string> = {};

  useGlobalStore.subscribe(
    state => state.zenCode,
    zenCode => {
      const { setCompiledCode } = useGlobalStore.getState();

      if (!zenCode) return;

      try {
        const ast = new Parser().parse(zenCode);

        if (ast && ast.length !== 0) {
          const compiledResult = new Compiler().compile(ast);
          const compiledNodes = compiledResult.toNodes();
          const compiledText = compiledResult.toText();

          setCompiledCode(compiledText);

          for (const ePosKey in errorPosMap) {
            const [errorLine, errorCol] = ePosKey.split(':').map(Number);
            const noError = compiledNodes.some(({ pos }) => {
              if (Number(pos.source?.start.line) > errorLine) {
                return true;
              }

              if (
                Number(pos.source?.start.line) === errorLine &&
                Number(pos.source?.start.col) >= errorCol
              ) {
                return true;
              }

              return false;
            });

            if (noError) {
              delete errorPosMap[ePosKey as ErrorPosKey];
            } else {
              const lastSourceNodePos = [...compiledNodes]
                .reverse()
                .find(({ pos }) => pos.source)!.pos;

              if (errorLine > Number(lastSourceNodePos.source?.start.line)) {
                delete errorPosMap[ePosKey as ErrorPosKey];
              } else if (
                errorLine === Number(lastSourceNodePos.source?.start.line) &&
                errorCol >= Number(lastSourceNodePos.source?.start.col)
              ) {
                delete errorPosMap[ePosKey as ErrorPosKey];
              }
            }
          }
        }
      } catch (error: any) {
        if ('col' in error && 'line' in error && 'message' in error) {
          const errorPosKey = `${error.line}:${error.col}` as const;

          if (Reflect.has(errorPosMap, errorPosKey)) return;

          errorPosMap[errorPosKey] = error.message;
        }

        console.dir(error);
      }

      const errorRefreshTimer = setInterval(() => {
        const { zenMonaco } = useGlobalStore.getState();

        if (zenMonaco) {
          clearInterval(errorRefreshTimer);
          refreshZenMonacoError(zenMonaco);
        }
      }, 300);
    },
    { fireImmediately: true }
  );

  function refreshZenMonacoError(monaco: Monaco) {
    monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', []);

    for (const ePosKey in errorPosMap) {
      const [line, col] = ePosKey.split(':').map(Number);

      monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', [
        {
          startLineNumber: line,
          startColumn: col,
          endLineNumber: line,
          endColumn: col + 1,
          message: errorPosMap[ePosKey as ErrorPosKey],
          severity: monaco.MarkerSeverity.Error
        }
      ]);
    }
  }
})();
