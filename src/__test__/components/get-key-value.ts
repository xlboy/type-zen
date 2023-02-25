import * as ast from "../../ast";
import * as utils from "../utils";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import type { Component } from "./types";
import { unionComponents } from "./union";

export { components as getKeyValueComponents };

const components: Component[] = [];

typeReferenceComponents.forEach((ref) => {
  literalComponents.all.forEach((lit) => {
    components.push({
      content: `${ref.content}[${lit.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: ast.Type.SyntaxKind.E.GetKeyValue,
        output: `${ref.node.output}[${lit.node.output}]`,
        source: ref.node,
        key: lit.node,
      }),
    });
  });

  typeReferenceComponents.forEach((ref2) => {
    components.push({
      content: `${ref.content}[${ref2.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: ast.Type.SyntaxKind.E.GetKeyValue,
        output: `${ref.node.output}[${ref2.node.output}]`,
        source: ref.node,
        key: ref2.node,
      }),
    });
  });

  unionComponents.all.slice(0, 100).forEach((union) => {
    components.push({
      content: `${ref.content}[${union.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: ast.Type.SyntaxKind.E.GetKeyValue,
        output: `${ref.node.output}[${union.node.output}]`,
        source: ref.node,
        key: union.node,
      }),
    });
  });
});
