import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as expr from '../expressions';
import * as utils from '../utils';
import type { Statement } from '.';

export { statements as enumStatements };

const statements: Statement[] = [];

for (let i = 0; i < 100; i++) {
  const memberNum = _.random(1, 10);

  const memberNodes: utils.TestNode[] = [];
  let enumOutput = '';
  let enumContent = '';

  for (let i = 0; i < memberNum; i++) {
    const isLast = i === memberNum - 1;
    const memberId = _.sample(expr.identifierTemplates)!;
    const hasValue = _.random(0, 1) === 1;
    const value = hasValue
      ? _.sample([...expr.literalExpressions.number, ...expr.literalExpressions.string])!
      : undefined;

    const output = memberId + (hasValue ? ` = ${value!.node.output}` : '');

    enumOutput += `\n  ${output}`;
    enumContent += `\n  ${memberId}` + (hasValue ? ` = ${value!.node.output}` : '');

    if (!isLast) {
      enumOutput += ',';
      enumContent += ',';
    } else {
      enumOutput += '\n';
    }

    const node = utils.createNode({
      instance: ast.EnumMemberExpression,
      kind: SyntaxKind.E.EnumMember,
      output,
      name: utils.createNode({
        instance: ast.IdentifierExpression,
        output: memberId
      })
    });

    if (hasValue) node.value = value!.node;

    memberNodes.push(node);
  }

  const enumId = _.sample(expr.identifierTemplates);
  const hasConst = _.random(0, 1) === 1;

  enumOutput = (hasConst ? 'const ' : '') + `enum ${enumId} {` + enumOutput + '}';

  enumContent =
    (hasConst ? 'const ' : '') + `enum         ${enumId} {` + enumContent + '\n}';

  statements.push({
    content: enumContent,
    node: utils.createNode({
      instance: ast.EnumStatement,
      kind: SyntaxKind.S.Enum,
      output: enumOutput,
      name: utils.createNode({
        instance: ast.IdentifierExpression,
        output: enumId
      }),
      members: memberNodes
    })
  });
}
