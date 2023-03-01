import * as ast from "../../ast";
import * as utils from "../utils";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import type { Component } from "./types";

export { components as unionComponents };

const components = (() => {
  const otherComponents: Component[] = [
    ...literalComponents.number,
    ...literalComponents.string,
    ...literalComponents.keyword,
    ...typeReferenceComponents,
  ];
  const permutedComponents = utils.permuteObjects(otherComponents, 2, 2);
  const result = {
    native: [] as Component[],
    extended: [] as Component[],
    all: [] as Component[],
  };

  for (const item of permutedComponents) {
    result.native.push({
      content: item.map(({ content }) => content).join(" | "),
      node: utils.createNode({
        instance: ast.UnionExpression,
        kind: ast.Type.SyntaxKind.E.Union,
        output: item.map(({ node }) => node.output).join(" | "),
        values: item.map(({ node }) => node),
        isExtended: false,
      }),
    });

    result.extended.push({
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

  result.all = [...result.native, ...result.extended];

  return result;
})();
