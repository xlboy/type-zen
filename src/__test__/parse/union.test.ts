import { describe, expect, it } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";
import { unionTemplate } from "../__resource__/syntax/expressions/union";

describe("native", () => {
  const unions = unionTemplate.valid.native;
  it("should not throw", () => {
    for (const u of unions) {
      const fn = () => new Parser(`type aaa  = ${u};`).toAST();
      expect(fn).not.throw();
    }
  });

  it("ast node", () => {
    for (const u of unions) {
      const nodes = new Parser(`type bbb = ${u}`).toAST();

      expect(nodes.length).not.toBe(0);
      expect(nodes[0]).instanceOf(ast.Base);

      const node = nodes[0] as ast.TypeDeclarationStatement;
      expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.Union);
    }
  });
});

describe("extended", () => {
  const unions = unionTemplate.valid.extended;
  it("should not throw", () => {
    for (const u of unions) {
      const fn = () => new Parser(`type aaa  = ${u};`).toAST();
      expect(fn).not.throw();
    }
  });

  it("ast node", () => {
    for (const u of unions) {
      const nodes = new Parser(`type bbb = ${u}`).toAST();

      expect(nodes.length).not.toBe(0);
      expect(nodes[0]).instanceOf(ast.Base);

      const node = nodes[0] as ast.TypeDeclarationStatement;
      expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.Union);
    }
  });
});
