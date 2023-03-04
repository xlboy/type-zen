import { it } from "vitest";
import * as ast from "../../../ast";
import { unionExpressions } from "..";
import * as utils from "../../utils";

function testUnion(
  expressions: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  expressions.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type B = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type B = ${node.output};`,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "B",
          }),
          value: node,
        }),
      ],
    });
  });
}

it("native", () => {
  testUnion(unionExpressions.native);
});

it("extended", () => {
  testUnion(unionExpressions.extended);
});

it("all", () => {
  testUnion(unionExpressions.all);
});
