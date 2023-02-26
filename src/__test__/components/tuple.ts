import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { literalComponents } from "./literal";
import { typeReferenceComponents } from "./type-reference";
import { Component } from "./types";
import { unionComponents } from "./union";
import { identifierTemplates } from "./identifier";

export { components as tupleComponents };

const permutedComponentGroup = utils.permuteObjects(
  [
    ...literalComponents.all,
    ..._.sampleSize(unionComponents.all, 200),
    ...typeReferenceComponents,
  ],
  1,
  2
);

const components: Component[] = [];

for (const pComponents of permutedComponentGroup) {
  const values: utils.TestNode<ast.TupleExpression>["values"] = [];
  let output = "[",
    content = "[";
  for (let index = 0; index < pComponents.length; index++) {
    const id = _.random(0, 1) === 1 ? _.sample(identifierTemplates)! : null;
    const deconstruction = _.random(0, 1) === 1;

    //#region  //*=========== item ===========
    const item: typeof values[number] = { deconstruction };
    item.id = id
      ? utils.createNode({
          instance: ast.IdentifierExpression,
          output: id,
        })
      : false;
    item.type = pComponents[index].node;

    values.push(item);
    //#endregion  //*======== item ===========

    //#region  //*=========== output, content ===========
    if (deconstruction) {
      output += "...";
      content += "...";
    }

    if (id) {
      output += `${id}: `;
      content += `${id} : `;
    }

    output += pComponents[index].node.output;
    content += pComponents[index].content;

    if (index !== pComponents.length - 1) {
      output += ", ";
      content += ", ";
    }
    //#endregion  //*======== output, content ===========
  }

  output += "]";
  content += "]";
  components.push({
    content,
    node: utils.createNode({
      instance: ast.TupleExpression,
      kind: ast.Type.SyntaxKind.E.Tuple,
      output,
      values,
    }),
  });
}
