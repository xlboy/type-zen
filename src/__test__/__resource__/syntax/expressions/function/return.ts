import * as utils from "../../../utils";
import * as ast from "../../../../../ast";

export { Return };

namespace Return {
  export const components = {
    assertAndIs: [
      {
        content: `asserts    this   is string`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: true,
          type: "aserrt-is",
          output: "aserrts this is string",
          assertSource: {
            type: "valueKeyword",
            value: "this",
          },
          target: utils.createNode({
            instance: ast.LiteralKeywordExpression,
            output: "string",
          }),
        }),
      },
      {
        content: `asserts  args is string[]`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: true,
          type: "aserrt-is",
          output: "aserrts args is string[]",
          assertSource: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "args",
          }),
          target: utils.createNode({
            instance: ast.ArrayExpression,
            output: "string[]",
            source: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
          }),
        }),
      },
    ],
    isOnly: [
      {
        content: `this is string`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: false,
          type: "is",
          output: "this is string",
          assertSource: {
            type: "valueKeyword",
            value: "this",
          },
          target: utils.createNode({
            instance: ast.LiteralKeywordExpression,
            output: "string",
          }),
        }),
      },
      {
        content: `args is string[]`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: false,
          type: "is",
          output: "args is string[]",
          assertSource: utils.createNode({
            instance: ast.IdentifierExpression,
            output: "args",
          }),
          target: utils.createNode({
            instance: ast.ArrayExpression,
            output: "string[]",
            source: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
          }),
        }),
      },
    ],
    normal: [
      {
        content: `string`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: false,
          type: "normal",
          output: "string",
          target: utils.createNode({
            instance: ast.LiteralKeywordExpression,
            output: "string",
          }),
        }),
      },
      {
        content: `string[]`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: false,
          type: "normal",
          output: "string[]",
          target: utils.createNode({
            instance: ast.ArrayExpression,
            output: "string[]",
            source: utils.createNode({
              instance: ast.LiteralKeywordExpression,
              output: "string",
            }),
          }),
        }),
      },
      {
        content: `string[][]`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: false,
          type: "normal",
          output: "string[][]",
          target: utils.createNode({
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
      },
      {
        content: `string[] | number[]`,
        node: utils.createNode({
          instance: ast.Function.Return.Expression,
          hasAsserts: false,
          type: "normal",
          output: "string[] | number[]",
          target: utils.createNode({
            instance: ast.UnionExpression,
            output: "string[] | number[]",
            values: [
              utils.createNode({
                instance: ast.ArrayExpression,
                output: "string[]",
                source: utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "string",
                }),
              }),
              utils.createNode({
                instance: ast.ArrayExpression,
                output: "number[]",
                source: utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "number",
                }),
              }),
            ],
          }),
        }),
      },
    ],
  };

  export const nodes = {
    assertAndIs: components.assertAndIs.map((item) =>
      utils.createSource({
        content: `type A = () => ${item.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = () => ${item.node.output};`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "A",
            }),
            value: utils.createNode({
              instance: ast.Function.Mode.Arrow.Expression,
              output: `() => ${item.node.output}`,
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
              }),
              return: item.node,
            }),
          }),
        ],
      })
    ),

    isOnly: components.isOnly.map((item) =>
      utils.createSource({
        content: `type A      = ()    => ${item.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = () => ${item.node.output};`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "A",
            }),
            value: utils.createNode({
              instance: ast.Function.Mode.Arrow.Expression,
              output: `() => ${item.node.output}`,
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
                output: "()",
              }),
              return: item.node,
            }),
          }),
        ],
      })
    ),

    normal: components.normal.map((item) =>
      utils.createSource({
        content: `type A = () => ${item.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: `type A = () => ${item.node.output};`,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "A",
            }),
            value: utils.createNode({
              instance: ast.Function.Mode.Arrow.Expression,
              output: `() => ${item.node.output}`,
              body: utils.createNode({
                instance: ast.Function.Body.Expression,
                output: "()",
              }),
              return: item.node,
            }),
          }),
        ],
      })
    ),
  };
}
