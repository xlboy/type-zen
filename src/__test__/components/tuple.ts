import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import { Component } from "./types";
import { unionComponents } from "./union";

export { components as tupleComponents };

const permutedComponents = utils.permuteObjects(
  [
    ...literalComponents.all,
    ..._.sampleSize(unionComponents.all, 200),
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
