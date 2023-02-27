import { it } from "vitest";
import * as ast from "../../../ast";
import { functionComponents } from "../../components";
import * as utils from "../../utils";

it("normal", () => {
  functionComponents.body.forEach((component) => {
    utils.assertSource({
      content: `type B = ${component.content} => void`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = ${component.node.output} => void;`,
          value: utils.createNode({
            instance: ast.Function.Mode.ArrowExpression,
            kind: ast.Type.SyntaxKind.E.Function_Arrow,
            body: component.node,
          }),
        }),
      ],
    });
  });
});
