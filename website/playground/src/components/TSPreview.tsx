import Editor from '@monaco-editor/react';
import { memo } from 'react';

import { presetTSCode } from '../data/base';
import { useGlobalStore } from '../store';

function TSPreview(): JSX.Element {
  const { compiledCode } = useGlobalStore();

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
}

export default memo(TSPreview);
