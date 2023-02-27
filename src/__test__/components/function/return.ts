import * as ast from "../../../ast";
import * as utils from "../../utils";
import { getKeyValueComponents } from "../get-key-value";
import { literalComponents } from "../literal";
import { tupleComponents } from "../tuple";
import { typeReferenceComponents } from "../type-reference";
import { Component } from "../types";
import { bracketSurroundComponents } from "../bracket-surround";
import { arrayComponents } from "../array";
import { conditionComponents, inferComponents } from "../condition";
import { unionComponents } from "../union";
import { identifierTemplates } from "../identifier";
import _ from "lodash-es";

export { components as returnComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ...tupleComponents.slice(0, 8000),
  ...getKeyValueComponents.slice(0, 8000),
  ...bracketSurroundComponents.slice(0, 8000),
  ...arrayComponents.slice(0, 8000),
  ...conditionComponents.all.slice(0, 200),
  ...inferComponents.all.slice(0, 200),
  ...unionComponents.all.slice(0, 8000),
];

const components: Record<"assertAndIs" | "isOnly" | "normal", Component[]> = {
  assertAndIs: [],
  isOnly: [],
  normal: [],
};

let i = 0;
for (const component of otherComponents) {
  const id = i % 2 === 0 ? "this" : _.sample(identifierTemplates)!;
  const assertSource: any =
    i % 2 === 0
      ? utils.createNode({
          instance: ast.LiteralKeywordExpression,
          output: "this",
        })
      : utils.createNode({
          instance: ast.IdentifierExpression,
          output: id,
        });

  components.assertAndIs.push({
    content: utils.mergeString("asserts ", id, " is ", component.content),
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: ast.Type.SyntaxKind.E.Function_Return,
      output: utils.mergeString("asserts ", id, " is ", component.node.output!),
      assertSource,
      type: "aserrt-is",
      target: component.node,
    }),
  });

  components.isOnly.push({
    content: utils.mergeString(id, " is ", component.content),
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: ast.Type.SyntaxKind.E.Function_Return,
      output: utils.mergeString(id, " is ", component.node.output!),
      assertSource,
      type: "is",
      target: component.node,
    }),
  });

  components.normal.push({
    content: component.content,
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: ast.Type.SyntaxKind.E.Function_Return,
      output: component.node.output,
      target: component.node,
    }),
  });

  i++;
}
