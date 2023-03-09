import { it } from 'vitest';

import * as ast from '../../../../ast';
import * as utils from '../../../utils';
import { functionExpressions } from '../..';

it('normal', () => {
  functionExpressions.arrow.forEach(expr => {
    utils.assertSource({
      content: `type B = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          outputStr: `type B = ${expr.node.outputStr}`,
          value: expr.node
        })
      ]
    });
  });
});
