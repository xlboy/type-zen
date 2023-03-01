import { describe, it } from "vitest";
import * as ast from "../../../ast";
import { conditionExpressions, inferExpressions } from "..";
import * as utils from "../../utils";

describe("condition", () => {
  it("native", () => {
    conditionExpressions.native.forEach((expr) => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            output: `type A = ${expr.node.output};`,
            value: expr.node,
          }),
        ],
      });
    });
  });

  it("extended", () => {
    conditionExpressions.extended.forEach((expr) => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            output: `type A = ${expr.node.output};`,
            value: expr.node,
          }),
        ],
      });
    });
  });
});

describe("infer", () => {
  it("native", () => {
    inferExpressions.native.forEach((expr) => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            output: `type A = ${expr.node.output};`,
            value: expr.node,
          }),
        ],
      });
    });
  });

  it("extended", () => {
    inferExpressions.extended.forEach((expr) => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            output: `type A = ${expr.node.output};`,
            value: expr.node,
          }),
        ],
      });
    });
  });
});
