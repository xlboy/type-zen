import { it } from "vitest";
import * as ast from "../../../ast";
import { functionComponents } from "../../components";
import * as utils from "../../utils";

it("normal", () => {
  functionComponents.constructor.forEach((component) => {
    console.log('component.content', component.content);
    
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
