import { Compiler, Parser } from '@type-zen/core';
import { merge } from 'lodash-es';
import type { O } from 'ts-toolbelt';
import type vscode from 'vscode';

import { log } from './log';

export { compile };

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

const defaultCompileOptions: O.Required<CompileOptions, string, 'deep'> = {
  console: {
    show: true,
    clear: true
  }
};

function compile(textEditor: vscode.TextEditor, options?: CompileOptions) {
  options = merge({}, defaultCompileOptions, options);

  if (options.console) {
    if (options.console.clear) {
      log.compile.clear();
    }

    if (options.console.show) {
      log.compile.show(true);
    }
  }

  const docText = textEditor.document.getText();

  try {
    const ast = new Parser().parse(docText);

    if (ast && ast.length !== 0) {
      const compiledResult = new Compiler().compile(ast);

      if (options.console) {
        log.compile.appendLine(compiledResult.toText());
      }
    }
  } catch (error) {
    console.error(error);
    if (options.console) {
      log.compile.appendLine((error as any).message);
    }
  }
}
