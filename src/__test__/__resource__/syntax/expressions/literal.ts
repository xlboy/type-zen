import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { Literal };

namespace Literal {
  export const template = {
    number: {
      valid: [
        "0",
        "8",
        "1921291",
        "1.11",
        "11.1",
        "11.1",
        "0.111",
        "-1.11",
        "-11.1",
        "-11.1",
        "2342341.111111111",
      ],
      invalid: ["1.1.1", "1231.111-", "1231.111+", "1231.111e", "1231.111e-"],
    },
    string: {
      valid: [
        '"123"',
        "'1111'",
        "`wwlklksdldfs.1111`",
        '"钅耂阝赛三三三朩"',
        "` 嗯？三地方似懂非懂赛  非非`",
      ],
      invalid: [
        '"123',
        "'1111",
        "`wwlklksdldfs.1111",
        "钅耂阝赛三三三朩",
        "123,..？？？。*！！@）&￥@&￥啊哦好",
      ],
    },
  } as const;

  export const nodes = {
    number: template.number.valid.map((numLiteral) => {
      const contents = ["type a =     ", numLiteral];
      const content = utils.mergeString(...contents);

      return utils.createSource({
        content,
        nodes: [
          utils.createNode<ast.TypeDeclarationStatement>({
            instance: ast.TypeDeclarationStatement,
            kind: ast.Type.SyntaxKind.S.TypeDeclaration,
            pos: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: content.length + 1 },
            },
            output: utils.mergeString("type a = ", numLiteral, ";"),
            identifier: {
              instance: ast.IdentifierExpression,
              kind: ast.Type.SyntaxKind.E.Identifier,
              output: "a",
              pos: { start: { line: 1, col: 6 }, end: { line: 1, col: 7 } },
            },
            value: {
              instance: ast.NumberLiteralExpression,
              kind: ast.Type.SyntaxKind.E.NumberLiteral,
              output: numLiteral,
              pos: {
                start: { line: 1, col: contents[0].length + 1 },
                end: { line: 1, col: content.length + 1 },
              },
            },
          }),
        ],
      });
    }),
    string: template.string.valid.map((strLiteral) => {
      const contents = ["type strrr =", strLiteral];
      const content = utils.mergeString(...contents);

      return utils.createSource({
        content,
        nodes: [
          utils.createNode<ast.TypeDeclarationStatement>({
            instance: ast.TypeDeclarationStatement,
            kind: ast.Type.SyntaxKind.S.TypeDeclaration,
            pos: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: content.length + 1 },
            },
            output: utils.mergeString("type strrr = ", strLiteral, ";"),
            identifier: {
              instance: ast.IdentifierExpression,
              kind: ast.Type.SyntaxKind.E.Identifier,
              output: "strrr",
              pos: { start: { line: 1, col: 6 }, end: { line: 1, col:  11 } },
            },
            value: {
              instance: ast.StringLiteralExpression,
              kind: ast.Type.SyntaxKind.E.StringLiteral,
              output: strLiteral,
              pos: {
                start: { line: 1, col: contents[0].length + 1 },
                end: { line: 1, col: content.length + 1 },
              },
            },
          }),
        ],
      });
    }),
  };
}
