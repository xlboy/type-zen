import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from './';
import { bracketSurroundExpressions } from './bracket-surround';
import { getKeyValueExpressions } from './get-key-value';
import { literalExpressions } from './literal';
import { tupleExpressions } from './tuple';
import { typeReferenceExpressions } from './type-reference';

export { expressions as arrayExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(tupleExpressions, 5000),
  ..._.sampleSize(getKeyValueExpressions, 5000),
  ..._.sampleSize(bracketSurroundExpressions, 5000)
];

const expressions: Expression[] = otherExpressions.map(expr => ({
  content: `${expr.content}[]`,
  node: utils.createNode({
    instance: ast.ArrayExpression,
    kind: SyntaxKind.E.Array,
    outputStr: `${expr.node.outputStr}[]`,
    source: expr.node
  })
}));
