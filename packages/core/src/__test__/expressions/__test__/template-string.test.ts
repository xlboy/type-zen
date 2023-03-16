import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { templateStringExpressions } from '..';

function testLiteral(
  expressions: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  expressions.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type A = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          outputStr: `type A = ${node.outputStr}`,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            outputStr: 'A'
          }),
          value: node
        })
      ]
    });
  });
}

it('literal', () => {
  testLiteral(templateStringExpressions.literal);
});

it('complex', () => {
  testLiteral(templateStringExpressions.complex);
});
