import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { typeOperatorExpressions } from '..';

it('normal', () => {
  typeOperatorExpressions.forEach(expr => {
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
