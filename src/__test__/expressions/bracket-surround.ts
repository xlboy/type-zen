import _ from "lodash-es";
import * as ast from "../../ast";
import * as utils from "../utils";
import { getKeyValueExpressions } from "./get-key-value";
import { literalExpressions } from "./literal";
import { tupleExpressions } from "./tuple";
import { typeReferenceExpressions } from "./type-reference";
import type { Expression } from "./";
import { unionExpressions } from "./union";
import { SyntaxKind } from "../../ast/constants";
export { expressions as bracketSurroundExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(unionExpressions.all, 2000),
  ..._.sampleSize(tupleExpressions, 2000),
  ..._.sampleSize(getKeyValueExpressions, 2000),
];

const expressions: Expression[] = otherExpressions.map((expr) => ({
  content: `(${expr.content})`,
  node: utils.createNode({
    instance: ast.BracketSurroundExpression,
    kind: SyntaxKind.E.BracketSurround,
    output: `(${expr.node.output})`,
    value: expr.node,
  }),
}));
