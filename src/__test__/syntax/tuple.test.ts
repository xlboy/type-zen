import { it } from "vitest";
import * as ast from "../../ast";
import { tupleComponents } from "../components";
import * as utils from "../utils";

it("normal", () => {
  tupleComponents.forEach((component) => {
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
