import * as ast from "../../ast";
import * as utils from "../utils";
import { getKeyValueComponents } from "./get-key-value";
import { literalComponents } from "./literal";
import { tupleComponents } from "./tuple";
import { typeReferenceComponents } from "./type-reference";
import { Component } from "./types";
import { bracketSurroundComponents } from "./bracket-surround";

export { components as arrayComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ...tupleComponents.slice(0, 10000),
  ...getKeyValueComponents.slice(0, 10000),
  ...bracketSurroundComponents.slice(0, 10000),
];

const components: Component[] = otherComponents.map((component) => ({
  content: `${component.content}[]`,
  node: utils.createNode({
    instance: ast.ArrayExpression,
    kind: ast.Type.SyntaxKind.E.Array,
    output: `${component.node.output}[]`,
    source: component.node,
  }),
}));
