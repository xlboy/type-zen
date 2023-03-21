import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from '.';
import { bracketSurroundExpressions } from './bracket-surround';
import { elementAccessExpressions } from './element-access';
import { literalExpressions } from './literal';
import { objectExpressions } from './object';
import { tupleExpressions } from './tuple';
import { typeReferenceExpressions } from './type-reference';

export { expressions as typeOperatorExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(tupleExpressions, 1000),
  ..._.sampleSize(elementAccessExpressions, 1000),
  ..._.sampleSize(objectExpressions.all, 1000),
  ..._.sampleSize(bracketSurroundExpressions, 1000)
];

const operators = ['keyof', 'readonly', 'typeof'];

const expressions: Expression[] = otherExpressions.map(expr => {
  const operator = _.sample(operators)!;

  return {
    content: `${operator}       ${expr.content}`,
    node: utils.createNode({
      instance: ast.TypeOperatorExpression,
      kind: SyntaxKind.E.TypeOperator,
      outputStr: `${operator} ${expr.node.outputStr}`,
      source: expr.node,
      operator
    })
  };
});
