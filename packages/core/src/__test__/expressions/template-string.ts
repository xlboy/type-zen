import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from '.';
import { bracketSurroundExpressions } from './bracket-surround';
import { elementAccessExpressions } from './element-access';
import { literalExpressions } from './literal';
import { tupleExpressions } from './tuple';
import { typeReferenceExpressions } from './type-reference';
import { unionExpressions } from './union';

export { expressions as templateStringExpressions };

const expressions = {
  literal: [] as Expression[],
  complex: [] as Expression[]
};
const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(unionExpressions.all, 1000),
  ..._.sampleSize(tupleExpressions, 1000),
  ..._.sampleSize(elementAccessExpressions, 1000),
  ...bracketSurroundExpressions
];

function generateRandomChar() {
  let str = '';

  for (let j = 0; j < _.random(5, 20); j++) {
    str += _.sampleSize(
      [
        '钅阝…',
        '似懂非懂将空地方三的',
        '\n',
        '  ',
        ' ',
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$^&*()_+-=,./<>?;:[]}|~'.split(
          ''
        ),
        '\\$\\{',
        '\\`'
      ],
      _.random(1, 5)
    );
  }

  return str;
}

(function initLiteral() {
  for (let i = 0; i < 1000; i++) {
    const content = '`' + generateRandomChar() + '`';

    const node = utils.createNode({
      instance: ast.TemplateStringExpression,
      kind: SyntaxKind.E.TemplateString,
      outputStr: content,
      values: [content.substring(1, content.length - 1)]
    });

    expressions.literal.push({
      content,
      node
    });
  }
})();

(function initComplex() {
  for (let i = 0; i < 1000; i++) {
    let content = '`';
    let output = '`';
    const values: utils.TestNode<ast.TemplateStringExpression>['values'] = [];

    let prevIsLiteral: boolean | null = null;

    for (let j = 0; j < _.random(2, 5); j++) {
      const isLiteral = _.random(0, 1) === 1;

      prevIsLiteral ??= isLiteral;

      if (isLiteral) {
        const randomChar = generateRandomChar();

        content += randomChar;
        output += randomChar;

        if (values.length === 0 || !prevIsLiteral) {
          values.push(randomChar as any);
        } else {
          values[values.length - 1] = (values.at(-1) as string) + randomChar;
        }
      } else {
        const randomExpr = _.sample(otherExpressions)!;

        content += '${' + randomExpr.content + '}';
        output += '${' + randomExpr.node.outputStr + '}';
        values.push(randomExpr.node);
      }

      prevIsLiteral = isLiteral;
    }

    content += '`';
    output += '`';

    const node = utils.createNode({
      instance: ast.TemplateStringExpression,
      kind: SyntaxKind.E.TemplateString,
      outputStr: output,
      values
    });

    expressions.complex.push({ content, node });
  }
})();
