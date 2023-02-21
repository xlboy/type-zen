import * as utils from "../../utils";
import * as ast from "../../../../ast";
export { GetKeyValue };

namespace GetKeyValue {
  export const nodes = [
    utils.createSource({
      content: `
        type A = Array["name"]
        type B = Object[KeyVar]['age']
        type C =   (Array | "Str")["name"]
        type D = Array["a" | "b"]
        type E = Array[| ["a" ,O["name"]]]
        `,
      nodes: [
        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type A = Array["name"];`,
          value: utils.createNode({
            instance: ast.GetKeyValueExpression,
            output: `Array["name"]`,
            key: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: `"name"`,
            }),
            source: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: "Array",
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type B = Object[KeyVar]['age'];`,
          value: utils.createNode({
            instance: ast.GetKeyValueExpression,
            output: "Object[KeyVar]['age']",
            source: utils.createNode({
              instance: ast.GetKeyValueExpression,
              output: "Object[KeyVar]",
              source: utils.createNode({
                instance: ast.TypeReferenceExpression,
                output: "Object",
              }),
              key: utils.createNode({
                instance: ast.TypeReferenceExpression,
                output: "KeyVar",
              }),
            }),
            key: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: `'age'`,
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type C = (Array | "Str")["name"];`,
          value: utils.createNode({
            instance: ast.GetKeyValueExpression,
            output: `(Array | "Str")["name"]`,
            source: utils.createNode({
              instance: ast.BracketSurroundExpression,
              output: `(Array | "Str")`,
              value: utils.createNode({
                instance: ast.UnionExpression,
                output: `Array | "Str"`,
                values: [
                  utils.createNode({
                    instance: ast.TypeReferenceExpression,
                    output: "Array",
                  }),
                  utils.createNode({
                    instance: ast.StringLiteralExpression,
                    output: `"Str"`,
                  }),
                ],
              }),
            }),
            key: utils.createNode({
              instance: ast.StringLiteralExpression,
              output: `"name"`,
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type D = Array["a" | "b"];`,
          value: utils.createNode({
            instance: ast.GetKeyValueExpression,
            output: `Array["a" | "b"]`,
            source: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: "Array",
            }),
            key: utils.createNode({
              instance: ast.UnionExpression,
              output: `"a" | "b"`,
              values: [
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: `"a"`,
                }),
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: `"b"`,
                }),
              ],
            }),
          }),
        }),

        utils.createNode({
          instance: ast.TypeDeclarationStatement,
          output: `type E = Array["a" | O["name"]];`,
          value: utils.createNode({
            instance: ast.GetKeyValueExpression,
            output: `Array["a" | O["name"]]`,
            source: utils.createNode({
              instance: ast.TypeReferenceExpression,
              output: "Array",
            }),
            key: utils.createNode({
              instance: ast.UnionExpression,
              output: `"a" | O["name"]`,
              values: [
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: `"a"`,
                }),
                utils.createNode({
                  instance: ast.GetKeyValueExpression,
                  output: `O["name"]`,
                  source: utils.createNode({
                    instance: ast.TypeReferenceExpression,
                    output: "O",
                  }),
                  key: utils.createNode({
                    instance: ast.StringLiteralExpression,
                    output: `"name"`,
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
