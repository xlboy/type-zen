import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { Condition };

namespace Condition {
  const template = {
    valid: {
      native: [
        "true extends false ? true : false",
        "123 extends 121 ? (1) : 2 extends 2 ? (3) : 4",
        "998 extends 1 ? boolean extends c<ddd> ? (1) : 2 extends 2 ? (3) : 4 : (1 | 2 | didi<dd>)",
      ],
      extended: [
        "123 == 121 ? 1 : 2 == 2 ? 3 : 4",
        "(123 == 121 ? 1 : 2) == 2 ? 3 : 4",
        '123 == 121 ? 1 : 2 == 2 ? 3 : (4 | 1 | true | "sss")',
      ],
    },
  };

  export const nodes = {
    native: [
      utils.createSource({
        content: `
        type name = true extends false ? "true--" : 123; 
        `,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type name = true extends false ? "true--" : 123;`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "name",
            }),
            value: utils.createNode({
              instance: ast.ConditionExpression,
              output: `true extends false ? "true--" : 123`,
              left: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "true",
              }),

              right: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "false",
              }),
              then: utils.createNode({
                instance: ast.StringLiteralExpression,
                output: `"true--"`,
              }),
              else: utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "123",
              }),
            }),
          }),
        ],
      }),
    ],

    extended: [
      utils.createSource({
        content: `
        type name = 123 == 121 ? 1 : 2 == 2 ? 3 : 4;
        `,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type name = 123 extends 121 ? 1 : 2 extends 2 ? 3 : 4;`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "name",
            }),
            value: utils.createNode({
              instance: ast.ConditionExpression,
              output: `123 extends 121 ? 1 : 2 extends 2 ? 3 : 4`,
              left: utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "123",
              }),
              right: utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "121",
              }),
              then: utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "1",
              }),

              else: utils.createNode({
                instance: ast.ConditionExpression,
                output: `2 extends 2 ? 3 : 4`,
                left: utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "2",
                }),
                right: utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "2",
                }),
                then: utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "3",
                }),
                else: utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "4",
                }),
              }),
            }),
          }),
        ],
      }),
    ],
  };
}
