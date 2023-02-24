import * as utils from "../../../utils";
import * as ast from "../../../../../ast";

export { Body };

namespace Body {
  export const components = [
    {
      content: `()`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        output: "()",
        args: [],
      }),
    },
    {
      content: `(a: string)`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        output: "(a: string)",
        args: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "a",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            rest: false,
          },
        ],
      }),
    },

    {
      content: `(a: string, b: string)`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        output: "(a: string, b: string)",
        args: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "a",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            rest: false,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "b",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            rest: false,
          },
        ],
      }),
    },

    {
      content: `(a: string, b: number, ...args: string[])`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        output: "(a: string, b: number, ...args: string[])",
        args: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "a",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            rest: false,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "b",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "number",
            }),
            rest: false,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "args",
            }),
            type: utils.createNode({
              instance: ast.ArrayExpression,
              output: "string[]",
              source: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "string",
              }),
            }),
            rest: true,
          },
        ],
      }),
    },

    {
      content: `(...a: any)`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        output: "(...a: any)",
        args: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "a",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "any",
            }),
            rest: true,
          },
        ],
      }),
    },

    {
      content: `(name : string, age : number, ...args : any[], ...args2 : any[], u: 1 | 2, fn: (a: string) => void)`,
      node: utils.createNode({
        instance: ast.Function.Body.Expression,
        output:
          "(name: string, age: number, ...args: any[], ...args2: any[], u: 1 | 2, fn: (a: string) => void)",
        args: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "name",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
            rest: false,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "age",
            }),
            type: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "number",
            }),
            rest: false,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "args",
            }),
            type: utils.createNode({
              instance: ast.ArrayExpression,
              output: "any[]",
              source: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "any",
              }),
            }),
            rest: true,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "args2",
            }),
            type: utils.createNode({
              instance: ast.ArrayExpression,
              output: "any[]",
              source: utils.createNode({
                instance: ast.LiteralKeywordExpression,
                output: "any",
              }),
            }),
            rest: true,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "u",
            }),
            type: utils.createNode({
              instance: ast.UnionExpression,
              output: "1 | 2",
              values: [
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "1",
                }),
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "2",
                }),
              ],
            }),
            rest: false,
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "fn",
            }),
            type: utils.createNode({
              instance: ast.Function.Mode.Arrow.Expression,
              output: "(a: string) => void",
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
                output: "(a: string)",
                args: [
                  {
                    id: utils.createNode({
                      instance: ast.IdentifierExpression,
                      output: "a",
                    }),
                    type: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      output: "string",
                    }),
                    rest: false,
                  },
                ],
              }),
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "void",
                type: "normal",
                target: utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "void",
                }),
              }),
            }),
            rest: false,
          },
        ],
      }),
    },
  ];

  export const nodes = [
    ...components.map((item) =>
      utils.createSource({
        content: `type A =  ${item.content} => void`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "A",
            }),
            output: `type A = ${item.node.output} => void;`,
            value: utils.createNode({
              instance: ast.Function.Mode.Arrow.Expression,
              body: item.node,
              output: `${item.node.output} => void`,
              return: utils.createNode({
                instance: ast.Function.Return.Expression,
                output: "void",
                type: "normal",
                target: utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "void",
                }),
              }),
            }),
          }),
        ],
      })
    ),
  ];
}
