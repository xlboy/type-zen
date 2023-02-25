import * as ast from "../../ast";
import * as utils from "../utils";
import { Component } from "./types";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import { unionComponents } from "./union";
import { tupleComponents } from "./tuple";
import { getKeyValueComponents } from "./get-key-value";
import { bracketSurroundComponents } from "./bracket-surround";

export { components as conditionComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ...unionComponents.all.slice(0, 10000),
  ...tupleComponents.slice(0, 10000),
  ...getKeyValueComponents.slice(0, 10000),
  ...bracketSurroundComponents,
];

const components: Record<"extended" | "native", Component[]> = {
  extended: [],
  native: [],
};

let i = 0;
while (i < otherComponents.length) {
  const left = otherComponents[i];
  const right = otherComponents[i + 1];
  const then = otherComponents[i + 2];
  const els = otherComponents[i + 3];

  if (!left || !right || !then || !els) break;

  const generateContent = (isNative: boolean) => {
    return utils.mergeString(
      left.content,
      isNative ? " extends " : " == ",
      right.content,
      " ? ",
      then.content,
      " : ",
      els.content
    );
  };

  const node = utils.createNode({
    instance: ast.ConditionExpression,
    kind: ast.Type.SyntaxKind.E.Condition,
    output: utils.mergeString(
      left.node.output!,
      " extends ",
      right.node.output!,
      " ? ",
      then.node.output!,
      " : ",
      els.node.output!
    ),
    left: left.node,
    right: right.node,
    then: then.node,
    else: els.node,
  });

  components.native.push({
    content: generateContent(true),
    node,
  });

  components.extended.push({
    content: generateContent(false),
    node,
  });

  i += 4;
}
