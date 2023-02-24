import { typeReferenceComponents } from "./type-reference";
import { literalComponents } from "./literal";
import { unionComponents } from "./union";
import * as utils from "../utils";
import { Component } from "./types";
import * as ast from "../../ast";

export { components as tupleComponents };

const permutedComponents = utils.permuteObjects(
  [
    ...literalComponents.all,
    ...unionComponents.all.slice(0, 200),
    ...typeReferenceComponents,
  ],
  1,
  2
);

const components: Component[] = permutedComponents.map((component) => ({
  content: utils.mergeString(
    "[",
    component.map((item) => item.content).join(","),
    "]"
  ),
  node: utils.createNode({
    instance: ast.TupleExpression,
    kind: ast.Type.SyntaxKind.E.Tuple,
    output: utils.mergeString(
      "[",
      component.map((item) => item.node.output).join(", "),
      "]"
    ),
    values: component.map((item) => item.node),
  }),
}));
