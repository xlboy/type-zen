import * as ast from "../../ast";
import * as utils from "../utils";
import { Component } from "./types";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import { unionComponents } from "./union";
import { tupleComponents } from "./tuple";
import { getKeyValueComponents } from "./get-key-value";

export { components as bracketSurroundComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ...unionComponents.all.slice(0, 2000),
  ...tupleComponents.slice(0, 2000),
  ...getKeyValueComponents.slice(0, 2000),
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
