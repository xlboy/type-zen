import { it } from "vitest";
import * as ast from "../../ast";
import { literalComponents } from "../components";
import * as utils from "../utils";

function testLiteral(
  components: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  components.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type A = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = ${node.output};`,
          identifier: utils.createNode({
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
  testLiteral(literalComponents.number);
});

it("string", () => {
  testLiteral(literalComponents.string);
});

it("keyword", () => {
  testLiteral(literalComponents.keyword);
});

it("all literal", () => {
  testLiteral(literalComponents.all);
});
