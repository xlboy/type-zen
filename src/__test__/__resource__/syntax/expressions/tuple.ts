import * as utils from "../../utils";
import * as ast from "../../../../ast";
export { Tuple };

namespace Tuple {
  export const nodes = [
    utils.createSource({
      content: `
        type A = [1, 2, 3];
        type B = [1, "", 3,];
        type C = [true, boolean, [1, Object[""]]]
        `,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = [1, 2, 3];`,
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "A",
          }),
          value: utils.createNode({
            instance: ast.TupleExpression,
            output: `[1, 2, 3]`,
            values: [
              utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "1",
              }),
              utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "2",
              }),
              utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "3",
              }),
            ],
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = [1, "", 3];`,
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "B",
          }),
          value: utils.createNode({
            instance: ast.TupleExpression,
            output: `[1, "", 3]`,
            values: [
              utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "1",
              }),
              utils.createNode({
                instance: ast.StringLiteralExpression,
                output: '""',
              }),
              utils.createNode({
                instance: ast.NumberLiteralExpression,
                output: "3",
              }),
            ],
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type C = [true, boolean, [1, Object[""]]];`,
          identifier: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "C",
          }),
          value: utils.createNode({
            instance: ast.TupleExpression,
            output: `[true, boolean, [1, Object[""]]]`,
            values: [
              utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "true",
              }),
              utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "boolean",
              }),
              utils.createNode({
                instance: ast.TupleExpression,
                output: `[1, Object[""]]`,
                values: [
                  utils.createNode({
                    instance: ast.NumberLiteralExpression,
                    output: "1",
                  }),
                  utils.createNode({
                    instance: ast.GetKeyValueExpression,
                    output: `Object[""]`,
                    source: utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      output: "Object",
                    }),
                    key: utils.createNode({
                      instance: ast.StringLiteralExpression,
                      output: '""',
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  ];
}
