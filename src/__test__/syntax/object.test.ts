import { describe, it } from "vitest";
import * as ast from "../../ast";
import { objectComponents } from "../components";
import * as utils from "../utils";

function testObject(
  components: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  components.forEach(({ content, node }) => {
    utils.assertSource({
      content: `type A = ${content}`,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = ${node.output};`,
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "A",
          }),
          value: node,
        }),
      ],
    });
  });
}

describe("simple", () => {
  it("call", () => {
    testObject(objectComponents.simple.call);
  });

  it("constructor", () => {
    testObject(objectComponents.simple.constructor);
  });

  it("method", () => {
    testObject(objectComponents.simple.method);
  });

  it("normal", () => {
    testObject(objectComponents.simple.method);
  });

  it("literalIndex", () => {
    testObject(objectComponents.simple.literalIndex);
  });

  it("indexSignature", () => {
    testObject(objectComponents.simple.indexSignature);
  });

  it("mapped", () => {
    testObject(objectComponents.simple.mapped);
  });
});

describe("complex", () => {
  it("call", () => {
    testObject(objectComponents.complex.call);
  });

  it("constructor", () => {
    testObject(objectComponents.complex.constructor);
  });
});
