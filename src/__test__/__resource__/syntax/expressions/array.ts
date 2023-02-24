import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { Array };

namespace Array {
  export const nodes = [
    utils.createSource({
      content: `
        type A = string[];
        type B = "sss"[]
        type C = string[][];
        type D =     ("a" | false | 1)[]
      `,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = string[];`,
          value: utils.createNode({
            instance: ast.ArrayExpression,
            output: "string[]",
            source: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = "sss"[];`,
          value: utils.createNode({
            instance: ast.ArrayExpression,
            output: `"sss"[]`,
            source: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: `"sss"`,
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type C = string[][];`,
          value: utils.createNode({
            instance: ast.ArrayExpression,
            output: "string[][]",
            source: utils.createNode({
              instance: ast.ArrayExpression,
              output: "string[]",
              source: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "string",
              }),
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type D = ("a" | false | 1)[];`,
          value: utils.createNode({
            instance: ast.ArrayExpression,
            output: `("a" | false | 1)[]`,
            source: utils.createNode({
              instance: ast.BracketSurroundExpression,
              value: utils.createNode({
                instance: ast.UnionExpression,
                output: `"a" | false | 1`,
                values: [
                  utils.createNode({
                    instance: ast.StringLiteralExpression,
                    output: `"a"`,
                  }),
                  utils.createNode({
                    instance: ast.LiteralKeywordExpression,
                    output: "false",
                  }),
                  utils.createNode({
                    instance: ast.NumberLiteralExpression,
                    output: "1",
                  }),
                ],
              }),
            }),
          }),
        }),
      ],
    }),
  ];
}
