import { literalComponents } from "./literal.test";
import * as utils from "../utils";
import * as ast from "../../ast";
import { Component } from "./types";
import { expect, it, test } from "vitest";

const components = (() => {
  const source = [
    ...literalComponents.number,
    ...literalComponents.string,
    ...literalComponents.keyword,
  ];
  const permutedNodes = utils.permuteObjects(source, 2, 2);
  const nodes = {
    native: [] as Component[],
    extended: [] as Component[],
    all: [] as Component[],
  };

  for (const item of permutedNodes) {
    nodes.native.push({
      content: item.map(({ content }) => content).join(" | "),
      node: utils.createNode({
        instance: ast.UnionExpression,
        kind: ast.Type.SyntaxKind.E.Union,
        output: item.map(({ node }) => node.output).join(" | "),
        values: item.map(({ node }) => node),
        isExtended: false,
      }),
    });

    nodes.extended.push({
      content: utils.mergeString(
        "| [",
        item.map(({ content }) => content).join(", "),
        "]"
      ),
      node: utils.createNode({
        instance: ast.UnionExpression,
        kind: ast.Type.SyntaxKind.E.Union,
        output: item.map(({ node }) => node.output).join(" | "),
        values: item.map(({ node }) => node),
        isExtended: true,
      }),
    });
  }

  nodes.all = [...nodes.native, ...nodes.extended];

  return nodes;
})();

function testUnion(
  components: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  components.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type B = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = ${node.output};`,
          identifier: utils.createNode({
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
  testUnion(components.native);
});

it("extended", () => {
  testUnion(components.extended);
});

it("all union", () => {
  testUnion(components.all);
});
