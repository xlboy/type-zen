import * as utils from "../../utils";
import * as ast from "../../../../ast";

export { Union };

namespace Union {
  export const components = {
    native: [
      {
        content: "'1' | 2",
        node: utils.createNode({
          instance: ast.UnionExpression,
          output: "'1' | 2",
          values: [
            utils.createNode({
              instance: ast.StringLiteralExpression,
              output: "'1'",
            }),
            utils.createNode({
              instance: ast.NumberLiteralExpression,
              output: "2",
            }),
          ],
        }),
      },
    ],
  };

  export const nodes = {
    native: [
      utils.createSource({
        content: "type u_ = '1' | 2;",
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: "type u_ = '1' | 2;",
            identifier: {
              instance: ast.IdentifierExpression as any,
              output: "u_",
            },
            value: utils.createNode({
              instance: ast.UnionExpression,
              output: "'1' | 2",
              values: [
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: "'1'",
                }),
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "2",
                }),
              ],
            }),
          }),
        ],
      }),
      utils.createSource({
        content: "type ubb_ = string | true | (boolean == 1 ? 2 : 1);",
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output: "type ubb_ = string | true | (boolean extends 1 ? 2 : 1);",
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "ubb_",
            }),
            value: utils.createNode({
              instance: ast.UnionExpression,
              output: "string | true | (boolean extends 1 ? 2 : 1)",
              values: [
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "string",
                }),
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "true",
                }),
                utils.createNode({
                  instance: ast.BracketSurroundExpression,
                  output: "(boolean extends 1 ? 2 : 1)",
                  value: utils.createNode({
                    instance: ast.ConditionExpression,
                    left: utils.createNode({
                      instance: ast.LiteralKeywordExpression,
                      output: "boolean",
                    }),
                    right: utils.createNode({
                      instance: ast.NumberLiteralExpression,
                      output: "1",
                    }),
                    then: utils.createNode({
                      instance: ast.NumberLiteralExpression,
                      output: "2",
                    }),
                    else: utils.createNode({
                      instance: ast.NumberLiteralExpression,
                      output: "1",
                    }),
                  }),
                }),
              ],
            }),
          }),
        ],
      }),

      utils.createSource({
        content:
          "type mmm =sss<ddd> | 123123 | true | 'sdfsdf' | null | undefined | void | ddd<dd<d<dd<dd>>>>;;;",
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output:
              "type mmm = sss<ddd> | 123123 | true | 'sdfsdf' | null | undefined | void | ddd<dd<d<dd<dd>>>>;",
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "mmm",
            }),
            value: utils.createNode({
              instance: ast.UnionExpression,
              output:
                "sss<ddd> | 123123 | true | 'sdfsdf' | null | undefined | void | ddd<dd<d<dd<dd>>>>",
              values: [
                utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  output: "sss<ddd>",
                  identifier: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "sss",
                  }),
                  arguments: [
                    utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      output: "ddd",
                    }),
                  ],
                }),
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "123123",
                }),
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "true",
                }),
                utils.createNode({
                  instance: ast.StringLiteralExpression,
                  output: "'sdfsdf'",
                }),
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "null",
                }),
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "undefined",
                }),
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "void",
                }),
                utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  output: "ddd<dd<d<dd<dd>>>>",
                  identifier: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "ddd",
                  }),
                  arguments: [
                    utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      output: "dd<d<dd<dd>>>",
                      arguments: [
                        utils.createNode({
                          instance: ast.TypeReferenceExpression,
                          output: "d<dd<dd>>",
                          arguments: [
                            utils.createNode({
                              instance: ast.TypeReferenceExpression,
                              output: "dd<dd>",
                              arguments: [
                                utils.createNode({
                                  instance: ast.TypeReferenceExpression,
                                  kind: ast.Type.SyntaxKind.E.TypeReference,
                                  output: "dd",
                                }),
                              ],
                            }),
                          ],
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
    ],
    extended: [
      utils.createSource({
        content: "type eee = | [string, 11, 3]",
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "eee",
            }),
            output: "type eee = string | 11 | 3;",
            value: utils.createNode({
              instance: ast.UnionExpression,
              output: "string | 11 | 3",
              values: [
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "string",
                }),
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "11",
                }),
                utils.createNode({
                  instance: ast.NumberLiteralExpression,
                  output: "3",
                }),
              ],
            }),
          }),
        ],
      }),

      utils.createSource({
        content: "type e2 = |[1| 2 | 3, name<sss>, void, (ss<sd> | ccc | 123)]",
        nodes: [
          utils.createNode({
            instance: ast.TypeDeclarationStatement,
            output:
              "type e2 = 1 | 2 | 3 | name<sss> | void | (ss<sd> | ccc | 123);",
            identifier: utils.createNode({
              instance: ast.IdentifierExpression,
              output: "e2",
            }),
            value: utils.createNode({
              instance: ast.UnionExpression,
              output: "1 | 2 | 3 | name<sss> | void | (ss<sd> | ccc | 123)",
              values: [
                utils.createNode({
                  instance: ast.UnionExpression,
                  output: "1 | 2 | 3",
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
                utils.createNode({
                  instance: ast.TypeReferenceExpression,
                  output: "name<sss>",
                  identifier: utils.createNode({
                    instance: ast.IdentifierExpression,
                    output: "name",
                  }),
                  arguments: [
                    utils.createNode({
                      instance: ast.TypeReferenceExpression,
                      output: "sss",
                      arguments: [],
                    }),
                  ],
                }),
                utils.createNode({
                  instance: ast.LiteralKeywordExpression,
                  output: "void",
                }),
                utils.createNode({
                  instance: ast.BracketSurroundExpression,
                  output: "(ss<sd> | ccc | 123)",
                  value: utils.createNode({
                    instance: ast.UnionExpression,
                    output: "ss<sd> | ccc | 123",
                    values: [
                      utils.createNode({
                        instance: ast.TypeReferenceExpression,
                        output: "ss<sd>",
                        identifier: utils.createNode({
                          instance: ast.IdentifierExpression,
                          output: "ss",
                        }),
                        arguments: [
                          utils.createNode({
                            instance: ast.TypeReferenceExpression,
                            output: "sd",
                            arguments: [],
                          }),
                        ],
                      }),
                      utils.createNode({
                        instance: ast.TypeReferenceExpression,
                        output: "ccc",
                      }),
                      utils.createNode({
                        instance: ast.NumberLiteralExpression,
                        output: "123",
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  };
}
