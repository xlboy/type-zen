import _ from 'lodash-es';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import type { Expression } from '../';
import { bodyExpressions } from './body';
import { returnExpressions } from './return';

export { expressions as arrowExpressions };

const expressions: Expression[] = [];

const allReturnExpressions = [
  ...returnExpressions.assertAndIs,
  ...returnExpressions.isOnly,
  ...returnExpressions.normal
];

for (const body of _.sampleSize(bodyExpressions, 1000)) {
  for (const ret of _.sampleSize(allReturnExpressions, 5)) {
    expressions.push({
      content: `${body.content} => ${ret.content}`,
      node: utils.createNode({
        instance: ast.Function.Mode.ArrowExpression,
        output: `${body.node.output} => ${ret.node.output}`,
        body: body.node,
        return: ret.node
      })
    });
  }
}
