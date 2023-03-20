import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { propertyAccessExpressions } from '..';

it('normal', () => {
  propertyAccessExpressions.forEach(expr => {
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
