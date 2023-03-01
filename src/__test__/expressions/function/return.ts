import * as ast from "../../../ast";
import * as utils from "../../utils";
import { getKeyValueExpressions } from "../get-key-value";
import { literalExpressions } from "../literal";
import { tupleExpressions } from "../tuple";
import { typeReferenceExpressions } from "../type-reference";
import { Expression } from "../types";
import { bracketSurroundExpressions } from "../bracket-surround";
import { arrayExpressions } from "../array";
import { conditionExpressions, inferExpressions } from "../condition";
import { unionExpressions } from "../union";
import { identifierTemplates } from "../identifier";
import _ from "lodash-es";

export { expressions as returnExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ...tupleExpressions.slice(0, 3000),
  ...getKeyValueExpressions.slice(0, 3000),
  ...bracketSurroundExpressions.slice(0, 3000),
  ...arrayExpressions.slice(0, 3000),
  ...conditionExpressions.all.slice(0, 200),
  ...inferExpressions.all.slice(0, 3000),
  ...unionExpressions.all.slice(0, 3000),
];

const expressions: Record<"assertAndIs" | "isOnly" | "normal", Expression[]> = {
  assertAndIs: [],
  isOnly: [],
  normal: [],
};

let i = 0;
for (const expr of otherExpressions) {
  const id = i % 2 === 0 ? "this" : _.sample(identifierTemplates)!;
  const assertSource: any =
    i % 2 === 0
      ? utils.createNode({
          instance: ast.LiteralKeywordExpression,
          output: "this",
        })
      : utils.createNode({
          instance: ast.IdentifierExpression,
          output: id,
        });

  expressions.assertAndIs.push({
    content: utils.mergeString("asserts ", id, " is ", expr.content),
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: ast.Type.SyntaxKind.E.Function_Return,
      output: utils.mergeString("asserts ", id, " is ", expr.node.output!),
      assertSource,
      type: "aserrt-is",
      target: expr.node,
    }),
  });

  expressions.isOnly.push({
    content: utils.mergeString(id, " is ", expr.content),
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: ast.Type.SyntaxKind.E.Function_Return,
      output: utils.mergeString(id, " is ", expr.node.output!),
      assertSource,
      type: "is",
      target: expr.node,
    }),
  });

  expressions.normal.push({
    content: expr.content,
    node: utils.createNode({
      instance: ast.Function.Return.Expression,
      kind: ast.Type.SyntaxKind.E.Function_Return,
      output: expr.node.output,
      target: expr.node,
    }),
  });

  i++;
}
