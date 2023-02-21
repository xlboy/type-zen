import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { TypeReference };

namespace TypeReference {
  export const nodes = [
    utils.createSource({
      content: `
      type A = Array<Ob<ss | ''>>
      `,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = Array<Ob<ss | ''>>;`,
          value: utils.createNode({
            instance: ast.TypeReferenceExpression,
            output: "Array<Ob<ss | ''>>",
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "Array",
            }),
            arguments: [
              utils.createNode({
                instance: ast.TypeReferenceExpression,
                output: "Ob<ss | ''>",
                identifier: utils.createNode({
                  instance: ast.IdentifierExpression,
                  output: "Ob",
                }),
                arguments: [
                  utils.createNode({
                    instance: ast.UnionExpression,
                    output: "ss | ''",
                    values: [
                      utils.createNode({
                        instance: ast.TypeReferenceExpression,
                        output: "ss",
                      }),
                      utils.createNode({
                        instance: ast.StringLiteralExpression,
                        output: "''",
                      }),
                    ],
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
