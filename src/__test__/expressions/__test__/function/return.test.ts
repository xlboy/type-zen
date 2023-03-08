import { describe, it } from 'vitest';
import * as ast from '../../../../ast';
import { functionExpressions } from '../..';
import * as utils from '../../../utils';
import { Expression } from '../../';

function testReturn(expressions: Expression[]) {
  expressions.forEach(expr => {
    utils.assertSource({
      content: `type A = () => ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type A = () => ${expr.node.output}`,
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
