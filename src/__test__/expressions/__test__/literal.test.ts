import { it } from "vitest";
import * as ast from "../../../ast";
import { literalExpressions } from "..";
import * as utils from "../../utils";

function testLiteral(
  expressions: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  expressions.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type A = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeAliasStatement,
          output: `type A = ${node.output};`,
          name: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "A",
          }),
          value: node,
        }),
      ],
    });
  });
}

it("number", () => {
  testLiteral(literalExpressions.number);
});

it("string", () => {
  testLiteral(literalExpressions.string);
});

it("keyword", () => {
  testLiteral(literalExpressions.keyword);
});

it("all literal", () => {
  testLiteral(literalExpressions.all);
});
