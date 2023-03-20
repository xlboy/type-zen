import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as expr from '../expressions';
import * as utils from '../utils';
import type { Statement } from '.';

export { statements as interfaceStatements };

const statements: Statement[] = [];

for (const objExpr of _.sampleSize(expr.objectExpressions.all, 2000)) {
  const id = _.sample(expr.identifierTemplates)!;

  const body = objExpr;
  const hasGenericArgs = _.random(0, 1) === 1;
  const genericArgs = hasGenericArgs ? _.sample(expr.genericArgsExpressions.all)! : null;

  let content = `interface   ${id}`;
  let output = `interface ${id}`;

  if (hasGenericArgs) {
    content += genericArgs!.content;
    output += genericArgs!.node.outputStr;
  }

  content += body.content;
  output += body.node.outputStr;

  const node = utils.createNode({
    instance: ast.InterfaceStatement,
    kind: SyntaxKind.S.Interface,
    outputStr: output,
    name: utils.createNode({
      instance: ast.IdentifierExpression,
      outputStr: id
    }),
    body: body.node
  });

  if (hasGenericArgs) node.arguments = genericArgs!.node;

  statements.push({ content, node });
}
