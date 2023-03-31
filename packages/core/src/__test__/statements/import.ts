import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Statement } from '.';

export { statements as importStatements };

const statements = {
  simple: [] as Statement[]
};

statements.simple = [
  {
    content: `import a from 'a'`,
    node: utils.createNode({
      instance: ast.ImportStatement,
      kind: SyntaxKind.S.ImportStatement,
      outputStr: "import a from 'a'",
      content: {
        aggregation: void 0,
        asTarget: void 0,
        id: utils.createNode({
          instance: ast.IdentifierExpression,
          outputStr: 'a'
        }) as any,
        type: void 0
      }
    })
  },
  {
    content: `import * as a from 'a'`,
    node: utils.createNode({
      instance: ast.ImportStatement,
      kind: SyntaxKind.S.ImportStatement,
      outputStr: "import * as a from 'a'",
      content: {
        aggregation: void 0,
        asTarget: utils.createNode({
          instance: ast.IdentifierExpression,
          outputStr: 'a'
        }) as any,
        type: void 0,
        id: void 0
      }
    })
  },
  {
    content: `import type *   /* 1 */  as b  from 'a'`,
    node: utils.createNode({
      instance: ast.ImportStatement,
      kind: SyntaxKind.S.ImportStatement,
      outputStr: "import type * as b from 'a'",
      content: {
        aggregation: void 0,
        asTarget: utils.createNode({
          instance: ast.IdentifierExpression,
          outputStr: 'b'
        }) as any,
        type: true,
        id: void 0
      }
    })
  },
  {
    content: `import type { type A, B as C } from './';`,
    node: utils.createNode({
      instance: ast.ImportStatement,
      kind: SyntaxKind.S.ImportStatement,
      outputStr: "import type { type A, B as C } from './'",
      content: {
        aggregation: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'A'
            }) as any,
            type: true,
            asTarget: void 0
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'B'
            }) as any,
            type: void 0,
            asTarget: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'C'
            }) as any
          }
        ],
        asTarget: void 0,
        id: void 0,
        type: true
      }
    })
  },
  {
    content: `import A, { type C, B as D } from 'a'`,
    node: utils.createNode({
      instance: ast.ImportStatement,
      kind: SyntaxKind.S.ImportStatement,
      outputStr: "import A, { type C, B as D } from 'a'",
      content: {
        aggregation: [
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'C'
            }) as any,
            type: true,
            asTarget: void 0
          },
          {
            id: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'B'
            }) as any,
            type: void 0,
            asTarget: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: 'D'
            }) as any
          }
        ],
        asTarget: void 0,
        id: utils.createNode({
          instance: ast.IdentifierExpression,
          outputStr: 'A'
        }) as any,
        type: void 0
      }
    })
  }
];
