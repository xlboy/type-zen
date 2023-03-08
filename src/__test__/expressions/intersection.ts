import { Expression } from ".";
import * as ast from "../../ast";
import { SyntaxKind } from "../../ast/constants";
import * as utils from "../utils";
import { literalExpressions } from "./literal";
import { typeReferenceExpressions } from "./type-reference";

export { expressions as intersectionExpressions };

const expressions = (() => {
  const otherExpressions: Expression[] = [
    ...literalExpressions.number,
    ...literalExpressions.string,
    ...literalExpressions.keyword,
    ...typeReferenceExpressions,
  ];
  const permutedExpressions = utils.permuteObjects(otherExpressions, 2, 2);
  const result = {
    native: [] as Expression[],
    extended: [] as Expression[],
    all: [] as Expression[],
  };

  for (const expr of permutedExpressions) {
    result.native.push({
      content: expr.map(({ content }) => content).join(" & "),
      node: utils.createNode({
        instance: ast.IntersectionExpression,
        kind: SyntaxKind.E.Intersection,
        output: expr.map(({ node }) => node.output).join(" & "),
        values: expr.map(({ node }) => node),
        isExtended: false,
      }),
    });

    result.extended.push({
      content: utils.mergeString(
        "& [",
        expr.map(({ content }) => content).join(", "),
        "]"
      ),
      node: utils.createNode({
        instance: ast.IntersectionExpression,
        kind: SyntaxKind.E.Intersection,
        output: expr.map(({ node }) => node.output).join(" & "),
        values: expr.map(({ node }) => node),
        isExtended: true,
      }),
    });
  }

  result.all = [...result.native, ...result.extended];

  return result;
})();
