import _ from "lodash-es";
import { Statement } from ".";
import * as ast from "../../ast";
import * as expr from "../expressions";
import * as utils from "../utils";

export { statements as enumStatements };

const statements: Statement[] = [];

for (let i = 0; i < 100; i++) {
  const memberNum = _.random(1, 10);

  const memberNodes: utils.TestNode[] = [];
  let enumOutput = "";
  let enumContent = "";

  for (let i = 0; i < memberNum; i++) {
    const memberId = _.sample(expr.identifierTemplates)!;
    const hasValue = _.random(0, 1) === 1;
    const value = hasValue
      ? _.sample([
          ...expr.literalExpressions.number,
          ...expr.literalExpressions.string,
        ])!
      : undefined;

    const eofChar = _.sample([",", ";"])!;

    const output =
      memberId + (hasValue ? ` = ${value!.node.output}` : "");

    enumOutput += `  ${output};\n`;
    enumContent +=
      `\n  ${memberId}` +
      (hasValue ? ` = ${value!.node.output}` : "") +
      eofChar;

    const node = utils.createNode({
      instance: ast.EnumMemberExpression,
      kind: ast.Type.SyntaxKind.E.EnumMember,
      output,
      name: utils.createNode({
        instance: ast.IdentifierExpression,
        output: memberId,
      }),
    });

    if (hasValue) node.value = value!.node;

    memberNodes.push(node);
  }

  const enumId = _.sample(expr.identifierTemplates);
  const hasConst = _.random(0, 1) === 1;

  enumOutput =
    (hasConst ? "const " : "") + `enum ${enumId} {\n` + enumOutput + "};";

  enumContent =
    (hasConst ? "const " : "") +
    `enum         ${enumId} {\n` +
    enumContent +
    "\n}";

  statements.push({
    content: enumContent,
    node: utils.createNode({
      instance: ast.EnumStatement,
      kind: ast.Type.SyntaxKind.S.Enum,
      output: enumOutput,
      name: utils.createNode({
        instance: ast.IdentifierExpression,
        output: enumId,
      }),
      members: memberNodes,
    }),
  });
}
