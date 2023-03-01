import * as ast from "../../ast";
import * as utils from "../utils";
import { literalExpressions } from "./literal";
import { typeReferenceExpressions } from "./type-reference";
import type { Expression } from "./types";
import { unionExpressions } from "./union";

export { expressions as getKeyValueExpressions };

const expressions: Expression[] = [];

typeReferenceExpressions.forEach((ref) => {
  literalExpressions.all.forEach((lit) => {
    expressions.push({
      content: `${ref.content}[${lit.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: ast.Type.SyntaxKind.E.GetKeyValue,
        output: `${ref.node.output}[${lit.node.output}]`,
        source: ref.node,
        key: lit.node,
      }),
    });
  });

  typeReferenceExpressions.forEach((ref2) => {
    expressions.push({
      content: `${ref.content}[${ref2.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: ast.Type.SyntaxKind.E.GetKeyValue,
        output: `${ref.node.output}[${ref2.node.output}]`,
        source: ref.node,
        key: ref2.node,
      }),
    });
  });

  unionExpressions.all.slice(0, 100).forEach((union) => {
    expressions.push({
      content: `${ref.content}[${union.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: ast.Type.SyntaxKind.E.GetKeyValue,
        output: `${ref.node.output}[${union.node.output}]`,
        source: ref.node,
        key: union.node,
      }),
    });
  });
});
