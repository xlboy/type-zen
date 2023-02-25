import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { getKeyValueComponents } from "./get-key-value";
import { literalComponents } from "./literal";
import { tupleComponents } from "./tuple";
import { typeReferenceComponents } from "./type-reference";
import { Component } from "./types";
import { unionComponents } from "./union";
export { components as bracketSurroundComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ..._.sampleSize(unionComponents.all, 2000),
  ..._.sampleSize(tupleComponents, 2000),
  ..._.sampleSize(getKeyValueComponents, 2000),
];

const components: Component[] = otherComponents.map((component) => ({
  content: `(${component.content})`,
  node: utils.createNode({
    instance: ast.BracketSurroundExpression,
    kind: ast.Type.SyntaxKind.E.BracketSurround,
    output: `(${component.node.output})`,
    value: component.node,
  }),
}));
