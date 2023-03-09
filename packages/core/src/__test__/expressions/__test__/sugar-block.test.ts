import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { sugarBlockExpressions } from '..';

it('simple', () => {
  sugarBlockExpressions.simple.forEach(expr => {
    const node = utils.createNode({
      instance: ast.TypeAliasStatement,
      value: expr.node
    });

    if (expr.node.outputReg) {
      node.outputReg = new RegExp(`type B = ${expr.node.outputReg.source}`);
    }

    if (expr.node.outputStr) {
      node.outputStr = `type B = ${expr.node.outputStr}`;
    }

    utils.assertSource({
      content: `type B = ${expr.content}`,
      nodes: [node]
    });
  });
});
