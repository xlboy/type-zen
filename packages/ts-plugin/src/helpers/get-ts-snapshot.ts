import fs from 'node:fs';

import { Compiler, Parser } from '@type-zen/core';
import type tsModule from 'typescript/lib/tsserverlibrary';

export { getTSSnapshot };

function getTSSnapshot(
  ts: typeof tsModule,
  tzenFilePath: string
): tsModule.IScriptSnapshot {
  const tzenFileCode = fs.readFileSync(tzenFilePath, 'utf8');

  try {
    const ast = new Parser().parse(tzenFileCode);

    if (ast && ast.length !== 0) {
      const compiledResult = new Compiler().compile(ast);

      return ts.ScriptSnapshot.fromString(`export {};\n${compiledResult.toText()}`);
    }
  } catch (error) {}

  return ts.ScriptSnapshot.fromString('export {}');
}
