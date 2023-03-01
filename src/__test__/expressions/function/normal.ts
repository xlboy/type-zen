import { Expression } from "../types";
import { bodyExpressions } from "./body";
import { returnExpressions } from "./return";
import * as utils from "../../utils";
import * as ast from "../../../ast";
import _ from "lodash-es";

export { expressions as normalExpressions };

const expressions: Expression[] = [];

const allReturnExpressions = [
  ...returnExpressions.assertAndIs,
  ...returnExpressions.isOnly,
  ...returnExpressions.normal,
];

for (const body of _.sampleSize(bodyExpressions, 1000)) {
  for (const ret of _.sampleSize(allReturnExpressions, 5)) {
    expressions.push({
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
