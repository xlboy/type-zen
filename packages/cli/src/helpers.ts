import fs from 'node:fs';
import path from 'node:path';

import { Compiler, Parser } from '@type-zen/core';
import * as colorette from 'colorette';
import consola from 'consola';

import type { InnerTypeZenConfig } from './config';

export { output };

interface OutputOptions {
  tzenFilePath: string;
  cwd: string;
  config: InnerTypeZenConfig;
}

function output(options: OutputOptions) {
  const { config, cwd, tzenFilePath } = options;

  try {
    const tzenFileContent = fs.readFileSync(tzenFilePath, { encoding: 'utf-8' });
    const compiledCode = (() => {
      let result = compile(tzenFileContent);

      if (config.compiler.output.ignoreCheck) {
        result = '// @ts-nocheck\n' + result;
      }

      return result;
    })();
    const outputFileSuffix = config.compiler.output.format === 'dts' ? '.d.ts' : '.ts';

    fs.writeFileSync(tzenFilePath + outputFileSuffix, compiledCode);

    const relativeTzenFilePath = path.relative(cwd, tzenFilePath + outputFileSuffix);

    consola.success(`Generated ${colorette.blue(relativeTzenFilePath)}`);
  } catch (e) {
    const cleanFilePath = tzenFilePath.replace(cwd, '');

    console.error(`[${cleanFilePath}]: ${e}`);
  }

  function compile(tzenFileContent: string) {
    const ast = new Parser().parse(tzenFileContent);

    if (ast && ast.length !== 0) {
      const compiledResult = new Compiler().compile(ast);

      return compiledResult.toText();
    }

    return '';
  }
}
