import { describe, expect, it } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";
import { conditionTemplate } from "../__resource__/syntax/expressions/condition";

describe("native", () => {
  const conditions = conditionTemplate.valid.native;
  it("should not throw", () => {
    for (const c of conditions) {
      const fn = () => new Parser(`type aaa  = ${c};`).toAST();
      expect(fn).not.throw();
    }
  });

  it("ast node", () => {
    for (const c of conditions) {
      const nodes = new Parser(`type bbb = ${c}`).toAST();

      expect(nodes.length).not.toBe(0);
      expect(nodes[0]).instanceOf(ast.Base);

      const node = nodes[0] as ast.TypeDeclarationStatement;
      expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.Condition);
    }
  });
});

describe("extended", () => {
  const conditions = conditionTemplate.valid.native;
  it("should not throw", () => {
    for (const c of conditions) {
      const fn = () => new Parser(`type aaa  = ${c};`).toAST();
      expect(fn).not.throw();
    }
  });

  it("ast node", () => {
    for (const c of conditions) {
      const nodes = new Parser(`type bbb = ${c}`).toAST();

      expect(nodes.length).not.toBe(0);
      expect(nodes[0]).instanceOf(ast.Base);

      const node = nodes[0] as ast.TypeDeclarationStatement;
      expect(node.value.kind).toBe(ast.Type.SyntaxKind.E.Condition);
    }
  });
});
