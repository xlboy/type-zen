import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { keyofExpressions } from '..';

it('normal', () => {
  keyofExpressions.forEach(expr => {
    utils.assertSource({
      content: `type A = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          outputStr: `type A = ${expr.node.outputStr}`,
          value: expr.node
        })
      ]
    });
  });
});
