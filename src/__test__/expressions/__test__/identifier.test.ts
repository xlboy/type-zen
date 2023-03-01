import { describe, expect, it } from "vitest";
import { NearleyError, Parser } from "../../../api/parser";
import * as ast from "../../../ast";
import { identifierTemplates, unionExpressions } from "..";
import * as utils from "../../utils";

describe("valid", () => {
  it("no arguments", () => {
    identifierTemplates.forEach((template) => {
      utils.createSource({
        content: `type ${template} = any;`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: template,
            }),
          }),
        ],
      });
    });
  });

  it("has arguments", () => {});
});

it("invalid", () => {
  const templates = [
    "1name",
    "-f123",
    "#df",
    "1",
    "1.1",
    "1.1.1",
    "*sdfsdf",
    "sdfsdf*",
    "sdf'",
    "jjjsdf;",
    "sdf,",
    "sdf.",
    "sdf?",
  ];
  it("error throw: UnexpectedInput", () => {
    for (const id of templates) {
      const fn = () => new Parser(`type ${id} = 1;`).toAST();
      expect(fn).throw();

      try {
        fn();
      } catch (error) {
        expect(error).instanceOf(NearleyError.UnexpectedInput);
      }
    }
  });
});
