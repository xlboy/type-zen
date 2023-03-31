import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Statement } from '.';

export { statements as exportStatements };

const statements = {
  simple: {
    named: [] as Statement[],
    multipleNamed: [] as Statement[],
    default: [] as Statement[],
    re: [] as Statement[]
  }
};

(function initSimple() {
  statements.simple.named = [
    {
      content: `export type a =      1`,
      node: utils.createNode({
        instance: ast.Export.NamedStatement,
        kind: SyntaxKind.S.ExportNamed,
        outputStr: 'export type a = 1',
        body: utils.createNode({
          instance: ast.TypeAliasStatement,
          kind: SyntaxKind.S.TypeAlias,
          outputStr: 'type a = 1'
        })
      })
    }
  ];

  statements.simple.multipleNamed = [
    {
      content: `export { type a, b, type c as d }`,
      node: utils.createNode({
        instance: ast.Export.MultipleNamedStatement,
        kind: SyntaxKind.S.ExportMultipleNamed,
        outputStr: 'export { type a, b, type c as d }',
        hasType: false,
        aggregation: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'a'
            }),
            type: true,
            asTarget: void 0
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'b'
            }),
            type: void 0,
            asTarget: void 0
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'c'
            }),
            type: true,
            asTarget: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'd'
            })
          }
        ]
      })
    },
    {
      content: `export type { a }`,
      node: utils.createNode({
        instance: ast.Export.MultipleNamedStatement,
        kind: SyntaxKind.S.ExportMultipleNamed,
        outputStr: 'export type { a }',
        hasType: true,
        aggregation: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'a'
            }),
            type: void 0,
            asTarget: void 0
          }
        ]
      })
    },
    {
      content: `export type { A, B as default }`,
      node: utils.createNode({
        instance: ast.Export.MultipleNamedStatement,
        kind: SyntaxKind.S.ExportMultipleNamed,
        outputStr: 'export type { A, B as default }',
        hasType: true,
        aggregation: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'A'
            }),
            type: void 0,
            asTarget: void 0
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'B'
            }),
            type: void 0,
            asTarget: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'default'
            })
          }
        ]
      })
    }
  ];

  statements.simple.default = [
    {
      content: `export default a`,
      node: utils.createNode({
        instance: ast.Export.DefaultStatement,
        kind: SyntaxKind.S.ExportDefault,
        outputStr: 'export default a',
        name: utils.createNode({
          instance: ast.IdentifierExpression,
          outputStr: 'a'
        })
      })
    }
  ];

  statements.simple.re = [
    {
      content: `export * as a from 'b'`,
      node: utils.createNode({
        instance: ast.Export.ReStatement,
        kind: SyntaxKind.S.ExportRe,
        outputStr: "export * as a from 'b'",
        sourcePath: utils.createNode({
          instance: ast.StringLiteralExpression,
          outputStr: "'b'"
        }),
        content: {
          aggregation: void 0,
          asTarget: utils.createNode({
            instance: ast.IdentifierExpression,
            outputStr: 'a'
          }) as any,
          type: void 0
        }
      })
    },
    {
      content: `export * from "ccc"`,
      node: utils.createNode({
        instance: ast.Export.ReStatement,
        kind: SyntaxKind.S.ExportRe,
        outputStr: 'export * from "ccc"',
        sourcePath: utils.createNode({
          instance: ast.StringLiteralExpression,
          outputStr: '"ccc"'
        }),
        content: { aggregation: void 0, asTarget: void 0, type: void 0 }
      })
    },
    {
      content: `export    type * as C from 'b'`,
      node: utils.createNode({
        instance: ast.Export.ReStatement,
        kind: SyntaxKind.S.ExportRe,
        outputStr: "export type * as C from 'b'",
        sourcePath: utils.createNode({
          instance: ast.StringLiteralExpression,
          outputStr: "'b'"
        }),
        content: {
          aggregation: void 0,
          asTarget: utils.createNode({
            instance: ast.IdentifierExpression,
            outputStr: 'C'
          }) as any,
          type: true
        }
      })
    },
    {
      content: `export { a,type b as c,} from 'b'`,
      node: utils.createNode({
        instance: ast.Export.ReStatement,
        kind: SyntaxKind.S.ExportRe,
        outputStr: "export { a, type b as c } from 'b'",
        sourcePath: utils.createNode({
          instance: ast.StringLiteralExpression,
          outputStr: "'b'"
        }),
        content: {
          aggregation: [
            {
              id: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'a'
              }) as any,
              type: void 0,
              asTarget: void 0
            },
            {
              id: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'b'
              }) as any,
              type: true,
              asTarget: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'c'
              }) as any
            }
          ],
          asTarget: void 0,
          type: void 0
        }
      })
    },
    {
      content: `export type { a, dd } from 'b'`,
      node: utils.createNode({
        instance: ast.Export.ReStatement,
        kind: SyntaxKind.S.ExportRe,
        outputStr: "export type { a, dd } from 'b'",
        sourcePath: utils.createNode({
          instance: ast.StringLiteralExpression,
          outputStr: "'b'"
        }),
        content: {
          aggregation: [
            {
              id: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'a'
              }) as any,
              type: void 0,
              asTarget: void 0
            },
            {
              id: utils.createNode({
                instance: ast.IdentifierExpression,
                outputStr: 'dd'
              }) as any,
              type: void 0,
              asTarget: void 0
            }
          ],
          asTarget: void 0,
          type: true
        }
      })
    }
  ];
})();
