import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { sugarBlockExpressions } from '..';

it('simple', () => {
  sugarBlockExpressions.simple.forEach(expr => {
    utils.assertSource({
      content: `type B = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output:
            expr.node.output instanceof RegExp
              ? new RegExp(`type B = ${expr.node.output.source}`)
              : `type B = ${expr.node.output}`,
          value: expr.node
        })
      ]
    });
  });
});
