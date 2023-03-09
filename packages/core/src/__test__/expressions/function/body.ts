import _ from 'lodash-es';

import * as ast from '../../../ast';
import { SyntaxKind } from '../../../ast/constants';
import * as utils from '../../utils';
import type { Expression } from '../';
import { arrayExpressions } from '../array';
import { bracketSurroundExpressions } from '../bracket-surround';
import { conditionExpressions, inferExpressions } from '../condition';
import { getKeyValueExpressions } from '../get-key-value';
import { identifierTemplates } from '../identifier';
import { literalExpressions } from '../literal';
import { tupleExpressions } from '../tuple';
import { typeReferenceExpressions } from '../type-reference';
import { unionExpressions } from '../union';

export { expressions as bodyExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(tupleExpressions, 3000),
  ..._.sampleSize(getKeyValueExpressions, 3000),
  ..._.sampleSize(bracketSurroundExpressions, 3000),
  ..._.sampleSize(arrayExpressions, 3000),
  // TODO：比较耗性能…
  ..._.sampleSize(conditionExpressions.all, 200),
  ..._.sampleSize(inferExpressions.all, 200),
  ..._.sampleSize(unionExpressions.all, 3000)
];

const expressions: Expression[] = [];

let currentArgSize = 0;
let currentArgs: NonNullable<utils.TestNode<ast.Function.Body.Expression>['args']> = [];

for (let j = 0, i = 0, output = '', content = ''; i < otherExpressions.length; i++, j++) {
  const expr = otherExpressions[i];
  const id = _.sample(identifierTemplates)!;
  const optional = _.random(0, 1) === 0;
  const rest = _.random(0, 1) === 0;

  currentArgs.push({
    id: utils.createNode({
      instance: ast.IdentifierExpression,
      outputStr: id
    }),
    optional,
    rest,
    type: expr.node
  });

  if (rest) {
    output += '...';
    content += '...';
  }

  output += id;
  content += id;

  if (optional) {
    output += '?';
    content += '?';
  }

  output += ': ' + expr.node.outputStr!;
  content += ': ' + expr.content;

  if (j === currentArgSize) {
    expressions.push({
      content: `(${content})`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        kind: SyntaxKind.E.FunctionBody,
        outputStr: `(${output})`,
        args: currentArgs
      })
    });

    currentArgSize = _.random(1, 6);
    j = 0;
    content = '';
    output = '';
    currentArgs = [];
  } else {
    output += ', ';
    content += ', ';
  }
}
