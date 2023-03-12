import useUrlState from '@ahooksjs/use-url-state';
import type { Monaco } from '@monaco-editor/react';
import Editor, { loader } from '@monaco-editor/react';
import { useMount } from 'ahooks';
import * as monaco from 'monaco-editor';
import { tw } from 'twind';

import { useGlobalStore } from '../../store';
import { codeCompression } from '../../utils';
import { config, language, languageID } from './monaco-config';

function initEditor(_: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
  monaco.languages.register({ id: languageID });
  monaco.languages.setMonarchTokensProvider(languageID, language as any);
  monaco.languages.setLanguageConfiguration(languageID, config);
  monaco.languages.registerCompletionItemProvider(languageID, {
    triggerCharacters: ['.', '!', '$'],
    provideCompletionItems: async (model, position) => {
      const wordAtPositon = model.getWordUntilPosition(position);

      return {
        suggestions: []
      };
    }
  });
}

function TypeZenEditor(): JSX.Element {
  const { setZenCode, zenCode, setZenMonaco } = useGlobalStore();
  const [, setUrlState] = useUrlState({ code: '', example: '' });

  useMount(() => {
    loader.config({ monaco });
    loader.init();
  });

  return (
    <>
      <Editor
        height="100vh"
        className={tw`min-w-[50%]`}
        language={languageID}
        onChange={code => handleCodeChange(code || '')}
        onMount={(instance, monaco) => {
          setZenMonaco(monaco);
          initEditor(instance, monaco);
        }}
        value={zenCode}
        options={{
          minimap: {
            enabled: false
          }
        }}
      />
    </>
  );

  function handleCodeChange(code: string) {
    if (code === '') return;

    setUrlState({
      code: encodeURIComponent(codeCompression.deflate(code)),
      example: undefined
    });

    setZenCode(code);
  }
}

export default TypeZenEditor;
