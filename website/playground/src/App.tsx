import Editor from '@monaco-editor/react';
import { compiler, Parser } from '@type-zen/core';
import { useMount } from 'ahooks';
import { memo, useState } from 'react';
import { tw } from 'twind';

function App() {
  const [compiledCode, setCompiledCode] = useState('');
  const defaultZenCode = `
  type Name = "xlboy"

type A<T> = ^{
if (T == Name) {
return "这是我的名称"
} else if (T == number) {
if (T == 1) {
  return "传了个 数字1 进来"
}
return "传了个其他数字进来";
}

return ["即不是 number 也不是名？…是 ->", T]
}

type Test1 = A<"xlboy">
type Test2 = A<1>
type Test3 = A<2333>
type Test4 = A<| [":)", "酷酷酷"]>

`;

  useMount(() => {
    handleZenCodeChange(defaultZenCode);
  });

  return (
    <div className={tw('w-full h-[100vh] p-[10px] flex')}>
      <textarea
        className={tw('min-w-[50%] h-full p-[10px]')}
        onChange={e => handleZenCodeChange(e.target.value)}
        defaultValue={defaultZenCode}
      ></textarea>
      <TSPreview compiledCode={compiledCode} />
    </div>
  );

  function handleZenCodeChange(zenCode: string) {
    try {
      const ast = new Parser(zenCode).toAST();

      if (ast.length !== 0) {
        const compiledText = compiler.compile(ast).toText();

        setCompiledCode(compiledText);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const TSPreview = memo((props: { compiledCode: string }) => {
  const presetValue = `// @ts-ignore
const returnSymbol: unique symbol = Symbol();

type UnreturnedSymbol = typeof returnSymbol;

// -----------------------output-----------------------

`;

  return (
    <Editor
      height="100vh"
      defaultLanguage="typescript"
      value={presetValue + props.compiledCode}
      options={{
        minimap: {
          enabled: false
        },
        readOnly: true
      }}
    />
  );
});

export default App;
