import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from './';

export { expressions as literalExpressions };

const templates = {
  number: [
    '0',
    '8',
    '1921291',
    '1.11',
    '11.1',
    '0.111',
    '-1.11',
    '-11.1',
    '2342341.111111111'
  ],
  string: ['"123"', "'1111'", '"钅耂阝赛三三三朩"'],
  keyword: [
    'string',
    'number',
    'null',
    'undefined',
    'never',
    'any',
    'symbol',
    'void',
    'unknown',
    'this',
    ...['true', 'false', 'boolean']
  ]
} as const;
const expressions = (() => {
  const result: Record<keyof typeof templates, Expression[]> = {
    number: templates.number.map(num => ({
      content: num,
      node: utils.createNode({
        instance: ast.NumberLiteralExpression,
        kind: SyntaxKind.E.NumberLiteral,
        outputStr: num
      })
    })),
    string: [
      ...templates.string.map(str => ({
        content: str,
        node: utils.createNode({
          instance: ast.StringLiteralExpression,
          kind: SyntaxKind.E.StringLiteral,
          outputStr: str
        })
      }))
    ],
    keyword: templates.keyword.map(keyword => ({
      content: keyword,
      node: utils.createNode({
        instance: ast.LiteralKeywordExpression,
        kind: SyntaxKind.E.LiteralKeyword,
        outputStr: keyword
      })
    }))
  };

  return {
    ...result,
    all: [...result.number, ...result.string, ...result.keyword]
  };
})();
