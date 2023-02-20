import * as utils from "../../utils";
import * as ast from "../../../../ast";
export { BracketSurround };

function wrapper(template: string[]) {
  return template.map((item) => `(${item})`);
}

namespace BracketSurround {
  const template = {
    valid: {},
  };

  export const nodes = [
    utils.createSource({
      content: `
      type a = (11)

      type b = (3 | '')

      type c = (a<c> | b)
      `,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: "type a = (11);",
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "a",
          }),
          value: utils.createNode({
            instance: ast.BracketSurroundExpression,
            output: "(11)",
            value: utils.createNode({
              instance: ast.NumberLiteralExpression,
              output: "11",
            }),
          }),
        }),
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: "type b = (3 | '');",
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "b",
          }),
          value: utils.createNode({
            instance: ast.BracketSurroundExpression,
            output: "(3 | '')",
            value: utils.createNode({
              instance: ast.UnionExpression,
              output: "3 | ''",
              values: [
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "3",
                }),
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: "''",
                }),
              ],
            }),
          }),
        }),
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "c",
          }),
          output: "type c = (a<c> | b);",
          value: utils.createNode({
            instance: ast.BracketSurroundExpression,
            output: "(a<c> | b)",
            value: utils.createNode({
              instance: ast.UnionExpression,
              output: "a<c> | b",
              values: [
                utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  output: "a<c>",
                  identifier: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "a",
                  }),
                  arguments: [
                    utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      output: "c",
                      identifier: utils.createNode({
                        instance: ast.IdentifierExpression,
                        output: "c",
                      }),
                    }),
                  ],
                }),
                utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  output: "b",
                  identifier: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "b",
                  }),
                }),
              ],
            }),
          }),
        }),
      ],
    }),
  ];
}
