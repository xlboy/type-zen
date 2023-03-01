import { it } from "vitest";
import * as ast from "../../../ast";
import { arrayExpressions } from "..";
import * as utils from "../../utils";

it("normal", () => {
  arrayExpressions.forEach((expr) => {
    utils.assertSource({
      content: `type B = ${expr.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type B = ${expr.node.output};`,
          value: expr.node,
        }),
      ],
    });
  });
});
