import { describe, it } from "vitest";
import * as ast from "../../../ast";
import { functionComponents } from "../../components";
import * as utils from "../../utils";
import { Component } from "../../components/types";

function testReturn(components: Component[]) {
  components.forEach((component) => {
    utils.assertSource({
      content: `type A = () => ${component.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = () => ${component.node.output};`,
          value: utils.createNode({
            instance: ast.Function.Mode.Arrow.Expression,
            return: component.node,
          }),
        }),
      ],
    });
  });
}
describe.concurrent("normal", () => {
  it("assertAndIs", () => {
    testReturn(functionComponents.return.assertAndIs);
  });

  it.concurrent("isOnly", () => {
    testReturn(functionComponents.return.isOnly);
  });

  it.concurrent("normal", () => {
    testReturn(functionComponents.return.normal);
  });
});
