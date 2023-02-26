import { describe, it } from "vitest";
import * as ast from "../../ast";
import { conditionComponents, inferComponents } from "../components";
import * as utils from "../utils";

describe("condition", () => {
  it("native", () => {
    conditionComponents.native.forEach((component) => {
      utils.assertSource({
        content: `type A = ${component.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = ${component.node.output};`,
            value: component.node,
          }),
        ],
      });
    });
  });

  it("extended", () => {
    conditionComponents.extended.forEach((component) => {
      utils.assertSource({
        content: `type A = ${component.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = ${component.node.output};`,
            value: component.node,
          }),
        ],
      });
    });
  });
});

describe("infer", () => {
  it("native", () => {
    inferComponents.native.forEach((component) => {
      utils.assertSource({
        content: `type A = ${component.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = ${component.node.output};`,
            value: component.node,
          }),
        ],
      });
    });
  });

  it("extended", () => {
    inferComponents.extended.forEach((component) => {
      utils.assertSource({
        content: `type A = ${component.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = ${component.node.output};`,
            value: component.node,
          }),
        ],
      });
    });
  });
});
