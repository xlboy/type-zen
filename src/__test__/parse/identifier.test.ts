import { describe, expect, it } from "vitest";
import { Parser } from "../../api/parser";
import * as ast from "../../ast";
import { identifierTemplate } from "../__resource__/syntax/expressions/identifier";

describe("valid", () => {
  function forFn(fn: (id: string) => void) {
    for (const id of identifierTemplate.valid) {
      fn(id);
    }
  }

  it("should not throw", () => {
    forFn((id) => {
      const fn = () => new Parser(`type ${id} = 1`).toAST();
      expect(fn).not.throw();
    });
  });

  it("ast node", () => {
    forFn((id) => {
      const nodes = new Parser(`type ${id} = 1`).toAST();

      expect(nodes.length).not.toBe(0);
      expect(nodes[0]).instanceOf(ast.Base);

      const node = nodes[0] as ast.TypeDeclarationStatement;
      expect(node.identifier.kind).toBe(ast.Type.SyntaxKind.E.Identifier);
      expect(node.identifier.pos).toMatchObject({
        start: { col: 6, line: 1 },
        end: { col: 6 + id.length, line: 1 },
      } as ast.Type.Position);

    });
  });
});

it("invalid", () => {
  for (const id of identifierTemplate.invalid) {
    const fn = () => new Parser(`type ${id} = 1`).toAST();
    expect(fn).throw();
  }
});
