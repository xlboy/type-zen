import { merge } from 'lodash-es';

import type { ASTBase } from '../ast';
import type { TopLevelStatementBase } from '../ast/statements/top-level/base';
import type { CompilerConfig } from './types';

export { compiler };

class Compiler {
  private topNodePos = new WeakMap<ASTBase, Record<'col' | 'line', number>>();

  public config: CompilerConfig = {
    indent: 2,
    memberSeparator: ';',
    useLineTerminator: true
  };

  public compile(statements: TopLevelStatementBase[]) {
    for (const stmt of statements) {
      const compiledNodeGroup = stmt.compile();

      const str = compiledNodeGroup.reduce((prev, curr) => {
        let str = '';

        curr.forEach(node => {
          str += node.text;
        });

        return prev + str;
      }, '');

      console.log(str);
    }
  }

  public updateConfig(config: CompilerConfig) {
    merge(this.config, config);
  }
}

const compiler = new Compiler();
