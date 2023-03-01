import { it } from "vitest";
import * as ast from "../../../../ast";
import { functionExpressions } from "../..";
import * as utils from "../../../utils";

it("normal", () => {
  functionExpressions.body.forEach((expr) => {
    utils.assertSource({
      content: `type B = ${expr.content} => void`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type B = ${expr.node.output} => void;`,
          value: utils.createNode({
            instance: ast.Function.Mode.ArrowExpression,
            kind: ast.Type.SyntaxKind.E.Function_Arrow,
            body: expr.node,
          }),
        }),
      ],
    });
  });
});
