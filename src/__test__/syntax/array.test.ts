import { it } from "vitest";
import * as ast from "../../ast";
import { arrayComponents } from "../components";
import * as utils from "../utils";

it("normal", () => {
  arrayComponents.forEach((component) => {
    utils.assertSource({
      content: `type B = ${component.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = ${component.node.output};`,
          value: component.node,
        }),
      ],
    });
  });
});
