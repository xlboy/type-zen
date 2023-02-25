import { it } from "vitest";
import * as ast from "../../../ast";
import { functionComponents } from "../../components";
import * as utils from "../../utils";

it("normal", () => {
  functionComponents.arrow.forEach((component) => {
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
