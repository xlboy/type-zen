import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { intersectionExpressions } from '..';

function testIntersection(
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
  testIntersection(intersectionExpressions.native);
});

it('extended', () => {
  testIntersection(intersectionExpressions.extended);
});

it('all', () => {
  testIntersection(intersectionExpressions.all);
});
