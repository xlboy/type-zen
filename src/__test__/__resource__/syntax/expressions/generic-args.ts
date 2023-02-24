import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { GenericArgs };

namespace GenericArgs {
  export const nodes = {
    extended: [
      utils.createSource({
        content: `type ddd<id> = 1;`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type ddd<id> = 1;`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: `ddd`,
            }),
            arguments: utils.createNode({
              instance: ast.GenericArgsExpression,
              output: `<id>`,
              values: [
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: `id`,
                  }),
                },
              ],
            }),
          }),
        ],
      }),
      utils.createSource({
        content: `type abc<id, c : string> = 2;`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type abc<id, c extends string> = 2;`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: `abc`,
            }),
            arguments: utils.createNode({
              instance: ast.GenericArgsExpression,
              output: `<id, c extends string>`,
              values: [
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: `id`,
                  }),
                },
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: `c`,
                  }),
                  type: utils.createNode({
                    instance: ast.LiteralKeywordExpression,
                    output: `string`,
                  }),
                },
              ],
            }),
          }),
        ],
      }),
      utils.createSource({
        content: `type _d<Keys extends string | any, Id = 1, SSSS : string = "????"> = "3"`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type _d<Keys extends string | any, Id = 1, SSSS extends string = "????"> = "3";`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: `_d`,
            }),
            arguments: utils.createNode({
              instance: ast.GenericArgsExpression,
              output: `<Keys extends string | any, Id = 1, SSSS extends string = "????">`,
              values: [
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: `Keys`,
                  }),
                  type: utils.createNode({
                    instance: ast.UnionExpression,
                    output: `string | any`,
                    values: [
                      utils.createNode({
                        instance: ast.LiteralKeywordExpression,
                        output: "string",
                      }),
                      utils.createNode({
                        instance: ast.LiteralKeywordExpression,
                        output: "any",
                      }),
                    ],
                  }),
                },
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: `Id`,
                  }),
                  default: utils.createNode({
                    instance: ast.NumberLiteralExpression,
                    output: `1`,
                  }),
                },
                {
                  id: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: `SSSS`,
                  }),
                  type: utils.createNode({
                    instance: ast.LiteralKeywordExpression,
                    output: `string`,
                  }),
                  default: utils.createNode({
                    instance: ast.StringLiteralExpression,
                    output: `"????"`,
                  }),
                },
              ],
            }),
          }),
        ],
      }),
    ],
  };
}
