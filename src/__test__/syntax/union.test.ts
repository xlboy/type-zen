import { it } from "vitest";
import * as ast from "../../ast";
import { unionComponents } from "../components";
import * as utils from "../utils";

function testUnion(
  components: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  components.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type B = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = ${node.output};`,
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "B",
          }),
          value: node,
        }),
      ],
    });
  });
}

it("native", () => {
  testUnion(unionComponents.native);
});

it("extended", () => {
  testUnion(unionComponents.extended);
});

it("all union", () => {
  testUnion(unionComponents.all);
});
