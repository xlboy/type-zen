import { describe, it } from "vitest";
import * as ast from "../../../ast";
import { genericArgsExpressions } from "..";
import * as utils from "../../utils";

describe.concurrent("normal", () => {
  it("native", () => {
    genericArgsExpressions.native.forEach((expr) => {
      utils.assertSource({
        content: `type A${expr.content} = 1`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A${expr.node.output} = 1;`,
            arguments: expr.node,
            value: utils.createNode({
              instance: ast.NumberLiteralExpression,
              output: `1`,
            }),
          }),
        ],
      });
    });
  });

  it("extended", () => {
    genericArgsExpressions.extended.forEach((expr) => {
      utils.assertSource({
        content: `type B${expr.content} = ''`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type B${expr.node.output} = '';`,
            arguments: expr.node,
            value: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: `''`,
            }),
          }),
        ],
      });
    });
  });
});
