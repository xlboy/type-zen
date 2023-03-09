import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { unionExpressions } from '..';

function testUnion(
  expressions: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  expressions.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type B = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          outputStr: `type B = ${node.outputStr}`,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            outputStr: 'B'
          }),
          value: node
        })
      ]
    });
  });
}

it('native', () => {
  testUnion(unionExpressions.native);
});

it('extended', () => {
  testUnion(unionExpressions.extended);
});

it('all', () => {
  testUnion(unionExpressions.all);
});
