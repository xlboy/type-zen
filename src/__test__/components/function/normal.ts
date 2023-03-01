import { Component } from "../types";
import { bodyComponents } from "./body";
import { returnComponents } from "./return";
import * as utils from "../../utils";
import * as ast from "../../../ast";
import _ from "lodash-es";

export { components as normalComponents };

const components: Component[] = [];

const allReturnComponents = [
  ...returnComponents.assertAndIs,
  ...returnComponents.isOnly,
  ...returnComponents.normal,
];

for (const body of _.sampleSize(bodyComponents, 1000)) {
  for (const ret of _.sampleSize(allReturnComponents, 5)) {
    components.push({
      content: `${body.content} : ${ret.content}`,
      node: utils.createNode({
        instance: ast.Function.Mode.NormalExpression,
        output: `${body.node.output}: ${ret.node.output}`,
        body: body.node,
        return: ret.node,
      }),
    });
  }
}
