import * as ast from "../../ast";
import * as utils from "../utils";
import type { Component } from "./types";

export { components as literalComponents };

const templates = {
  number: [
    "0",
    "8",
    "1921291",
    "1.11",
    "11.1",
    "0.111",
    "-1.11",
    "-11.1",
    "2342341.111111111",
  ],
  string: [
    '"123"',
    "'1111'",
    "`wwlklksdldfs.1111`",
    '"钅耂阝赛三三三朩"',
    "` 嗯？三地方似懂非懂赛  非非`",
    "`123,..？？？。*！！@）&￥@&￥啊哦好`",
    `' d d d '`,
  ],
  keyword: [
    "string",
    "number",
    "null",
    "undefined",
    "never",
    "any",
    "symbol",
    "void",
    "unknown",
    "this",
    ...["true", "false", "boolean"],
  ],
} as const;
const components = (() => {
  const result: Record<keyof typeof templates, Component[]> = {
    number: templates.number.map((num) => ({
      content: num,
      node: utils.createNode({
        instance: ast.NumberLiteralExpression,
        kind: ast.Type.SyntaxKind.E.NumberLiteral,
        output: num,
      }),
    })),
    string: templates.string.map((str) => ({
      content: str,
      node: utils.createNode({
        instance: ast.StringLiteralExpression,
        kind: ast.Type.SyntaxKind.E.StringLiteral,
        output: str,
      }),
    })),
    keyword: templates.keyword.map((keyword) => ({
      content: keyword,
      node: utils.createNode({
        instance: ast.LiteralKeywordExpression,
        kind: ast.Type.SyntaxKind.E.LiteralKeyword,
        output: keyword,
      }),
    })),
  };

  return {
    ...result,
    all: [...result.number, ...result.string, ...result.keyword],
  };
})();
