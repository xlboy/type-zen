import { describe, it } from "vitest";
import * as ast from "../../ast";
import { genericArgsComponents } from "../components";
import * as utils from "../utils";

describe.concurrent("normal", () => {
  it("native", () => {
    genericArgsComponents.native.forEach((component) => {
      utils.assertSource({
        content: `type A${component.content} = 1`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A${component.node.output} = 1;`,
            arguments: component.node,
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
    genericArgsComponents.extended.forEach((component) => {
      utils.assertSource({
        content: `type B${component.content} = ''`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type B${component.node.output} = '';`,
            arguments: component.node,
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
