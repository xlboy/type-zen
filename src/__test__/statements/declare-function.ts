import _ from "lodash-es";
import { Statement } from ".";
import * as ast from "../../ast";
import * as expr from "../expressions";
import * as utils from "../utils";

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
    output += body.node.output;
  }

  output += ";";

  const node = utils.createNode({
    instance: ast.DeclareFunctionStatement,
    kind: ast.Type.SyntaxKind.S.DeclareFunction,
    output,
    name: utils.createNode({
      instance: ast.IdentifierExpression,
      output: id,
    }),
  });

  if (hasBody) node.body = body.node;

  statements.push({ content, node });
}
