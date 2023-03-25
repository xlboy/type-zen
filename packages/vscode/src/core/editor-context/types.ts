import type { CompiledNode } from '@type-zen/core';

export type { EditorInfo, CompileOptions };

type Pos = {
  start: { line: number; col: number };
  end: { line: number; col: number };
};

interface EditorInfo {
  isUntitled: boolean;
  code: string;
  compiled: {
    nodes: CompiledNode[];
    tsCode: string;
  } | null;
  analyzedTSInfo: {
    errors: Array<{
      message: string;
      pos: Pos;
    }>;
    typeResult: Array<{
      type: string;
      pos: Pos;
    }>;
  } | null;
  nearleyErrorInfos: Array<{
    message: string;
    pos: Pos;
  }>;
}

interface CompileOptions {
  /** @default object */
  console:
    | false /* 未来不止 console 处显示编译结果 */
    | {
        /**
         * @default true
         */
        show?: boolean;

        /**
         * @default true
         */
        clear?: boolean;
      };
}
