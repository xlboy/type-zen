import { describe, expect, it } from "vitest";
import { Parser } from "../../api/parser";
import { bracketSurroundTemaplte } from "../__resource__/syntax/expressions/bracket-surround";
import * as ast from "../../ast";

describe("valid", () => {
  describe("type-reference", () => {
    const identifiers = bracketSurroundTemaplte.valid.identifier;
    it("should not throw", () => {
      for (const id of identifiers) {
        const fn = () => new Parser(`type a = ${id}`).toAST();
        expect(fn).not.throw();
      }
    });

    it("ast node", () => {
      for (const id of identifiers) {
        const nodes = new Parser(`type a = ${id}`).toAST();

        expect(nodes.length).not.toBe(0);
        expect(nodes[0]).instanceOf(ast.Base);

        const node = nodes[0] as ast.TypeDeclarationStatement;
        expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.BracketSurround);
        expect(node.value.compile().at(0)).toBe("(");
        expect(node.value.compile().at(-1)).toBe(")");
      }
    });
  });

  describe("literal", () => {
    describe("string", () => {
      const strings = bracketSurroundTemaplte.valid.literal.string;
      it("should not throw", () => {
        for (const str of strings) {
          const fn = () => new Parser(`type a = ${str}`).toAST();
          expect(fn).not.throw();
        }
      });

      it("ast node", () => {
        for (const str of strings) {
          const nodes = new Parser(`type a = ${str}`).toAST();

          expect(nodes.length).not.toBe(0);
          expect(nodes[0]).instanceOf(ast.Base);

          const node = nodes[0] as ast.TypeDeclarationStatement;
          expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.BracketSurround);
          expect(node.value.compile().at(0)).toBe("(");
          expect(node.value.compile().at(-1)).toBe(")");
        }
      });
    });

    describe("number", () => {
      const numbers = bracketSurroundTemaplte.valid.literal.number;
      it("should not throw", () => {
        for (const num of numbers) {
          const fn = () => new Parser(`type a = ${num}`).toAST();
          expect(fn).not.throw();
        }
      });

      it("ast node", () => {
        for (const num of numbers) {
          const nodes = new Parser(`type a = ${num}`).toAST();

          expect(nodes.length).not.toBe(0);
          expect(nodes[0]).instanceOf(ast.Base);

          const node = nodes[0] as ast.TypeDeclarationStatement;
          expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.BracketSurround);
          expect(node.value.compile().at(0)).toBe("(");
          expect(node.value.compile().at(-1)).toBe(")");
        }
      });
    });
  });
});
