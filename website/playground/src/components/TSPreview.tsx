import Editor from '@monaco-editor/react';
import { compiler, Parser } from '@type-zen/core';
import { memo, useEffect, useState } from 'react';

import { presetTSCode } from '../data/base';
import { useGlobalStore } from '../store';

function TSPreview(): JSX.Element {
  const { zenCode } = useGlobalStore();
  const [compiledCode, setCompiledCode] = useState('');

  useEffect(refreshCompiledCode, [zenCode]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="typescript"
      value={createOutput(compiledCode)}
      options={{
        minimap: {
          enabled: false
        },
        readOnly: true
      }}
    />
  );

  function createOutput(output: string) {
    return `${presetTSCode}\n// -----------------------output-----------------------\n${output}`;
  }

  function refreshCompiledCode() {
    if (zenCode === '') return;

    try {
      const ast = new Parser(zenCode).toAST();

      if (ast.length !== 0) {
        const compiledCode = compiler.compile(ast).toText();

        setCompiledCode(compiledCode);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default memo(TSPreview);
