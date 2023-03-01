import { describe, it } from "vitest";
import * as ast from "../../../ast";
import { objectExpressions } from "..";
import * as utils from "../../utils";

function testObject(
  expressions: {
    content: string;
    node: utils.TestNode;
  }[]
) {
  expressions.forEach(({ content, node }) => {
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
    testObject(objectExpressions.simple.call);
  });

  it("constructor", () => {
    testObject(objectExpressions.simple.constructor);
  });

  it("method", () => {
    testObject(objectExpressions.simple.method);
  });

  it("normal", () => {
    testObject(objectExpressions.simple.method);
  });

  it("literalIndex", () => {
    testObject(objectExpressions.simple.literalIndex);
  });

  it("indexSignature", () => {
    testObject(objectExpressions.simple.indexSignature);
  });

  it("mapped", () => {
    testObject(objectExpressions.simple.mapped);
  });
});

describe("complex", () => {
  it("call", () => {
    testObject(objectExpressions.complex.call);
  });

  it("constructor", () => {
    testObject(objectExpressions.complex.constructor);
  });

  it("method", () => {
    testObject(objectExpressions.complex.method);
  });

  it("normal", () => {
    testObject(objectExpressions.complex.normal);
  });

  it("literalIndex", () => {
    testObject(objectExpressions.complex.literalIndex);
  });

  it("indexSignature", () => {
    testObject(objectExpressions.complex.indexSignature);
  });
  
  it("mapped", () => {
    testObject(objectExpressions.complex.mapped);
  });
});
