import _ from "lodash-es";
import type { Expression } from ".";
import * as ast from "../../ast";
import * as utils from "../utils";
import { getKeyValueExpressions } from "./get-key-value";
import { literalExpressions } from "./literal";
import { tupleExpressions } from "./tuple";
import { typeReferenceExpressions } from "./type-reference";
import { objectExpressions } from "./object";
import { bracketSurroundExpressions } from "./bracket-surround";
import { SyntaxKind } from "../../ast/constants";
export { expressions as keyofExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(tupleExpressions, 1000),
  ..._.sampleSize(getKeyValueExpressions, 1000),
  ..._.sampleSize(objectExpressions.all, 1000),
  ..._.sampleSize(bracketSurroundExpressions, 1000),
];

const expressions: Expression[] = otherExpressions.map((expr) => ({
  content: `keyof       ${expr.content}`,
  node: utils.createNode({
    instance: ast.KeyofExpression,
    kind: SyntaxKind.E.Keyof,
    output: `keyof ${expr.node.output}`,
    source: expr.node,
  }),
}));
