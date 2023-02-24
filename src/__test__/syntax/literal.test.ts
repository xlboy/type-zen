import { it } from "vitest";
import * as ast from "../../ast";
import * as utils from "../utils";

export { components as literalComponents };

const components = (() => {
  const literals = {
    number: [
      "0",
      "8",
      "1921291",
      "1.11",
      "11.1",
      "0.111",
      "-1.11",
      "-11.1",
      "2342341.111111111",
    ],
    string: [
      '"123"',
      "'1111'",
      "`wwlklksdldfs.1111`",
      '"钅耂阝赛三三三朩"',
      "` 嗯？三地方似懂非懂赛  非非`",
      "`123,..？？？。*！！@）&￥@&￥啊哦好`",
      `' d d d '`,
    ],
    keybowrd: [
      "string",
      "number",
      "null",
      "undefined",
      "never",
      "any",
      "symbol",
      "void",
      "unknown",
      "this",
      ...["true", "false", "boolean"],
    ],
  } as const;

  const nodes = {
    number: literals.number.map((num) => ({
      content: num,
      node: utils.createNode({
        instance: ast.NumberLiteralExpression,
        kind: ast.Type.SyntaxKind.E.NumberLiteral,
        output: num,
      }),
    })),
    string: literals.string.map((str) => ({
      content: str,
      node: utils.createNode({
        instance: ast.StringLiteralExpression,
        kind: ast.Type.SyntaxKind.E.StringLiteral,
        output: str,
      }),
    })),
    keyword: literals.keybowrd.map((keyword) => ({
      content: keyword,
      node: utils.createNode({
        instance: ast.LiteralKeywordExpression,
        kind: ast.Type.SyntaxKind.E.LiteralKeyword,
        output: keyword,
      }),
    })),
  };

  return {
    ...nodes,
    all: [...nodes.number, ...nodes.string, ...nodes.keyword],
  };
})();

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
  testLiteral(components.number);
});

it("string", () => {
  testLiteral(components.string);
});

it("keyword", () => {
  testLiteral(components.keyword);
});

it("all literal", () => {
  testLiteral(components.all);
});
