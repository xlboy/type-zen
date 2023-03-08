import { it } from "vitest";
import * as ast from "../../../ast";
import { keyofExpressions } from "..";
import * as utils from "../../utils";

it("normal", () => {
  keyofExpressions.forEach((expr) => {
    utils.assertSource({
      content: `type A = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type A = ${expr.node.output}`,
          value: expr.node,
        }),
      ],
    });
  });
});
