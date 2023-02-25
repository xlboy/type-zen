import _ from "lodash-es";
import * as ast from "../../../ast";
import * as utils from "../../utils";
import { arrayComponents } from "../array";
import { bracketSurroundComponents } from "../bracket-surround";
import { conditionComponents } from "../condition";
import { getKeyValueComponents } from "../get-key-value";
import { identifierTemplates } from "../identifier";
import { literalComponents } from "../literal";
import { tupleComponents } from "../tuple";
import { typeReferenceComponents } from "../type-reference";
import { Component } from "../types";
import { unionComponents } from "../union";

export { components as bodyComponents };

const otherComponents = [
  ...literalComponents.all,
  ...typeReferenceComponents,
  ..._.sampleSize(tupleComponents, 5000),
  ..._.sampleSize(getKeyValueComponents, 5000),
  ..._.sampleSize(bracketSurroundComponents, 5000),
  ..._.sampleSize(arrayComponents, 5000),
  // TODO：比较耗性能…
  ..._.sampleSize(conditionComponents.all, 200),
  ..._.sampleSize(unionComponents.all, 5000),
];

const components: Component[] = [];

let currentArgSize = 0;
let currentArgs: NonNullable<
  utils.TestNode<ast.Function.Body.Expression>["args"]
> = [];
for (
  let j = 0, i = 0, output = "", content = "";
  i < otherComponents.length;
  i++, j++
) {
  const component = otherComponents[i];
  const id = _.sample(identifierTemplates)!;
  const optional = _.random(0, 1) === 0;
  const rest = _.random(0, 1) === 0;

  currentArgs.push({
    id: utils.createNode({
      instance: ast.IdentifierExpression,
      output: id,
    }),
    optional,
    rest,
    type: component.node,
  });

  if (rest) {
    output += "...";
    content += "...";
  }

  output += id;
  content += id;

  if (optional) {
    output += "?";
    content += "?";
  }

  output += ": " + component.node.output!;
  content += ": " + component.content;

  if (j === currentArgSize) {
    components.push({
      content: `(${content})`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        kind: ast.Type.SyntaxKind.E.FunctionBody,
        output: `(${output})`,
        args: currentArgs,
      }),
    });

    currentArgSize = _.random(1, 6);
    j = 0;
    content = "";
    output = "";
    currentArgs = [];
  } else {
    output += ", ";
    content += ", ";
  }
}
