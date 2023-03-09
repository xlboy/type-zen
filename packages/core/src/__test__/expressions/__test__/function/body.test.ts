import { it } from 'vitest';

import * as ast from '../../../../ast';
import { SyntaxKind } from '../../../../ast/constants';
import * as utils from '../../../utils';
import { functionExpressions } from '../..';

it('normal', () => {
  functionExpressions.body.forEach(expr => {
    utils.assertSource({
      content: `type B = ${expr.content} => void`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          outputStr: `type B = ${expr.node.outputStr} => void`,
          value: utils.createNode({
            instance: ast.Function.Mode.ArrowExpression,
            kind: SyntaxKind.E.FunctionArrow,
            body: expr.node
          })
        })
      ]
    });
  });
});
