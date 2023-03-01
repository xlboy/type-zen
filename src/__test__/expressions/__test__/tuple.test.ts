import { it } from "vitest";
import * as ast from "../../../ast";
import { tupleExpressions } from "..";
import * as utils from "../../utils";

it("normal", () => {
  tupleExpressions.forEach((expr) => {
    utils.assertSource({
      content: `type A = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = ${expr.node.output};`,
          value: expr.node,
        }),
      ],
    });
  });
});
