import { describe, it } from 'vitest';

import * as ast from '../../../../ast';
import * as utils from '../../../utils';
import { functionExpressions } from '../..';
import type { Expression } from '../../';

function testReturn(expressions: Expression[]) {
  expressions.forEach(expr => {
    utils.assertSource({
      content: `type A = () => ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          outputStr: `type A = () => ${expr.node.outputStr}`,
          value: utils.createNode({
            instance: ast.Function.Mode.ArrowExpression,
            return: expr.node
          })
        })
      ]
    });
  });
}

describe.concurrent('normal', () => {
  it('assertAndIs', () => {
    testReturn(functionExpressions.return.assertAndIs);
  });

  it.concurrent('isOnly', () => {
    testReturn(functionExpressions.return.isOnly);
  });

  it.concurrent('normal', () => {
    testReturn(functionExpressions.return.normal);
  });
});
