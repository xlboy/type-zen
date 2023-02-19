import { describe, expect, it } from "vitest";
import { NearleyError, Parser } from "../../api/parser";
import * as ast from "../../ast";
import { literalTemplate } from "../__resource__/syntax/expressions/literal";

describe("number", () => {
  describe("valid", () => {
    function forFn(fn: (numberLiteral: string) => void) {
      for (const numberLiteral of literalTemplate.number.valid) {
        fn(numberLiteral);
      }
    }

    it("should not throw", () => {
      forFn((numberLiteral) => {
        const fn = () => new Parser(`type a =   ${numberLiteral};`).toAST();
        expect(fn).not.throw();
      });
    });

    it("ast node", () => {
      forFn((numberLiteral) => {
        const contents = ["type b1 =       ", numberLiteral, ";;;;;;;;;;"];
        const contentStr = contents.join("");
        const astNodes = new Parser(contentStr).toAST();

        expect(astNodes.length).not.toBe(0);
        expect(astNodes[0]).instanceOf(ast.Base);

        const node = astNodes[0] as ast.TypeDeclarationStatement;
        expect(node.compile()).toBe(`type b1 = ${numberLiteral};`);
        expect(node.kind).toBe(ast.Type.SyntaxKind.S.TypeDeclaration);
        expect(node.pos).toMatchObject({
          start: { line: 1, col: 1 },
          end: { line: 1, col: `${contents[0]}${contents[1]}`.length + 1 },
        } as ast.Type.Position);

        expect(node.value).instanceOf(ast.NumberLiteralExpression);
        expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.NumberLiteral);
        expect(node.value.compile()).toBe(numberLiteral);
      });
    });
  });

  it("invalid", () => {
    for (const numberLiteral of literalTemplate.number.invalid) {
      const fn = () => new Parser(`type b = ${numberLiteral};`).toAST();
      expect(fn).throw();

      try {
        fn();
      } catch (error) {
        expect(error).instanceOf(NearleyError.UnexpectedInput);
      }
    }
  });
});

describe("string", () => {
  describe("valid", () => {
    function forFn(fn: (stringLiteral: string) => void) {
      for (const stringLiteral of literalTemplate.string.valid) {
        fn(stringLiteral);
      }
    }

    it("should not throw", () => {
      forFn((stringLiteral) => {
        const fn = () =>
          new Parser(`type str___ =   ${stringLiteral};`).toAST();
        expect(fn).not.throw();
      });
    });

    it("ast node", () => {
      forFn((stringLiteral) => {
        const contents = ["type ssss =", stringLiteral];
        const contentStr = contents.join("");
        const astNodes = new Parser(contentStr).toAST();

        expect(astNodes.length).not.toBe(0);
        expect(astNodes[0]).instanceOf(ast.TypeDeclarationStatement);

        const node = astNodes[0] as ast.TypeDeclarationStatement;
        expect(node.compile()).toBe(`type ssss = ${stringLiteral};`);
        expect(node.kind).toBe(ast.Type.SyntaxKind.S.TypeDeclaration);
        expect(node.pos).toMatchObject({
          start: { line: 1, col: 1 },
          end: { line: 1, col: `${contents[0]}${contents[1]}`.length + 1 },
        } as ast.Type.Position);

        expect(node.value).instanceOf(ast.StringLiteralExpression);
        expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.StringLiteral);
        expect(node.value.compile()).toBe(stringLiteral);
      });
    });
  });

  it("invalid", () => {
    for (const stringLiteral of literalTemplate.string.invalid) {
      const fn = () => new Parser(`type str = ${stringLiteral};`).toAST();
      expect(fn).throw();

      try {
        fn();
      } catch (error) {
        expect(error).instanceOf(NearleyError.UnexpectedInput);
      }
    }
  });
});
