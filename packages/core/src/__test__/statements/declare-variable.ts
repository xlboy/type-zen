import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as expr from '../expressions';
import * as utils from '../utils';
import type { Statement } from '.';

export { statements as declareVariableStatements };

const statements: Statement[] = [];

for (let index = 0; index < 2000; index++) {
  const id = _.sample(expr.identifierTemplates)!;
  const type = _.sample(['const', 'let', 'var'])!;
  const value = _.sample(expr.mainExpressions)!;
  const hasValue = _.random(0, 1) === 1;

  let content = `declare     ${type} ${id}`;
  let output = `declare ${type} ${id}`;

  if (hasValue) {
    content += `: ${value.content}`;
    output += `: ${value.node.outputStr}`;
  }

  const node = utils.createNode({
    instance: ast.DeclareVariableStatement,
    kind: SyntaxKind.S.DeclareVariable,
    outputStr: output,
    name: utils.createNode({
      instance: ast.IdentifierExpression,
      outputStr: id
    }),
    declareType: type as any
  });

  if (hasValue) node.value = value.node;

  statements.push({ content, node });
}
