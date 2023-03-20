import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from '.';
import { identifierTemplates } from './identifier';

export { expressions as propertyAccessExpressions };

const expressions: Expression[] = [];

for (let i = 0; i < 100; i++) {
  const firstId = _.sample(identifierTemplates)!;
  let content = firstId;
  let output = firstId;

  for (let j = 0; j < _.random(1, 5); j++) {
    const id = _.sample(identifierTemplates)!;

    content += `.${id}`;
    output += `.${id}`;
  }

  expressions.push({
    content,
    node: utils.createNode({
      instance: ast.PropertyAccessExpression,
      kind: SyntaxKind.E.PropertyAccess,
      outputStr: output
    })
  });
}
