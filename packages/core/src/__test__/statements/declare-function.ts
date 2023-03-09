import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as expr from '../expressions';
import * as utils from '../utils';
import type { Statement } from '.';

export { statements as declareFunctionStatements };

const statements: Statement[] = [];

for (let index = 0; index < 2000; index++) {
  const id = _.sample(expr.identifierTemplates)!;
  const body = _.sample(expr.functionExpressions.normal)!;
  const hasBody = _.random(0, 1) === 1;

  let content = `declare  function   ${id}`;
  let output = `declare function ${id}`;

  if (hasBody) {
    content += body.content;
    output += body.node.outputStr;
  }

  const node = utils.createNode({
    instance: ast.DeclareFunctionStatement,
    kind: SyntaxKind.S.DeclareFunction,
    outputStr: output,
    name: utils.createNode({
      instance: ast.IdentifierExpression,
      outputStr: id
    })
  });

  if (hasBody) node.body = body.node;

  statements.push({ content, node });
}
