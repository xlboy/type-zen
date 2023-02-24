import { it } from "vitest";
import * as ast from "../../ast";
import { typeReferenceComponents } from "../components";
import * as utils from "../utils";

it("normal", () => {
  typeReferenceComponents.forEach((component) => {
    utils.assertSource({
      content: `type A = ${component.content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = ${component.content};`,
          value: component.node,
        }),
      ],
    });
  });
});
