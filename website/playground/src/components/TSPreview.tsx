import Editor from '@monaco-editor/react';
import { memo } from 'react';

import { defaultPresetTSCode } from '../data/example';
import { useGlobalStore } from '../store';

function TSPreview(): JSX.Element {
  const { compiledCode, presetTSCode } = useGlobalStore();

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
    return [
      defaultPresetTSCode,
      !!presetTSCode ? `\n${presetTSCode}` : '',
      '\n',
      '// -----------------------output-----------------------',
      '\n',
      output
    ]
      .join('')
      .trimStart();
  }
}

export default memo(TSPreview);
