import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { typeReferenceExpressions } from '..';

it('normal', () => {
  typeReferenceExpressions.forEach(expr => {
    utils.assertSource({
      content: `type A = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type A = ${expr.content}`,
          value: expr.node
        })
      ]
    });
  });
});
