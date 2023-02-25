import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { bracketSurroundComponents } from "./bracket-surround";
import { getKeyValueComponents } from "./get-key-value";
import { literalComponents } from "./literal";
import { tupleComponents } from "./tuple";
import { typeReferenceComponents } from "./type-reference";
import { Component } from "./types";
import { unionComponents } from "./union";
export { components as conditionComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ..._.sampleSize(unionComponents.all, 10000),
  ..._.sampleSize(tupleComponents, 10000),
  ..._.sampleSize(getKeyValueComponents, 10000),
  ...bracketSurroundComponents,
];

const components: Record<"extended" | "native" | "all", Component[]> = {
  extended: [],
  native: [],
  all: [],
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

components.all = [...components.native, ...components.extended];
