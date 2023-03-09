import _ from 'lodash-es';

import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from './';
import { bracketSurroundExpressions } from './bracket-surround';
import { getKeyValueExpressions } from './get-key-value';
import { identifierTemplates } from './identifier';
import { literalExpressions } from './literal';
import { tupleExpressions } from './tuple';
import { typeReferenceExpressions } from './type-reference';
import { unionExpressions } from './union';

export { conditionExpressions, inferExpressions };

const otherExpressions = [
  ...literalExpressions.all,
  ...typeReferenceExpressions,
  ..._.sampleSize(unionExpressions.all, 3000),
  ..._.sampleSize(tupleExpressions, 3000),
  ..._.sampleSize(getKeyValueExpressions, 3000),
  ...bracketSurroundExpressions
];

const inferExpressions: Record<'extended' | 'native' | 'all', Expression[]> = (() => {
  const inferExpressions: Record<'extended' | 'native' | 'all', Expression[]> = {
    extended: [],
    native: [],
    all: []
  };

  for (let i = 0; i < 1000; i++) {
    const id = utils.createNode({
      instance: ast.IdentifierExpression,
      outputStr: _.sample(identifierTemplates)!
    });
    const extendsTypes: utils.TestNode<ast.ASTBase>[] = [];
    const hasExtendsTypes = _.random(0, 1) === 1;

    const native = {
      content: id.outputStr!,
      output: id.outputStr!
    };
    const extended = {
      content: id.outputStr!,
      output: id.outputStr!
    };

    if (hasExtendsTypes) {
      const extendsSize = _.random(1, 3);

      _.sampleSize(otherExpressions, extendsSize).forEach(item => {
        extendsTypes.push(item.node);

        native.content += ` extends ${item.content}`;
        native.output += ` extends ${item.node.outputStr}`;
        extended.content += ` == ${item.content}`;
        extended.output += ` extends ${item.node.outputStr}`;
      });
    }

    inferExpressions.native.push({
      content: `infer ${native.content}`,
      node: utils.createNode({
        instance: ast.InferExpression,
        kind: SyntaxKind.E.Infer,
        outputStr: `infer ${native.output}`,
        name: id,
        extendsTypes
      })
    });

    inferExpressions.extended.push({
      content: `infer ${extended.content}`,
      node: utils.createNode({
        instance: ast.InferExpression,
        kind: SyntaxKind.E.Infer,
        outputStr: `infer ${extended.output}`,
        name: id,
        extendsTypes
      })
    });
  }

  inferExpressions.all = [...inferExpressions.native, ...inferExpressions.extended];

  return inferExpressions;
})();

const conditionExpressions: Record<'extended' | 'native' | 'all', Expression[]> = (() => {
  const conditionExpressions: Record<'extended' | 'native' | 'all', Expression[]> = {
    extended: [],
    native: [],
    all: []
  };
  let i = 0;

  while (i < otherExpressions.length) {
    const hasInfer = _.random(0, 1) === 1;
    const left = otherExpressions[i];
    const right = hasInfer ? _.sample(inferExpressions.all) : otherExpressions[i + 1];
    const then = otherExpressions[i + 2];
    const els = otherExpressions[i + 3];

    if (!left || !right || !then || !els) break;

    const generateContent = (isNative: boolean) => {
      return utils.mergeString(
        left.content,
        isNative ? ' extends ' : ' == ',
        right.content,
        ' ? ',
        then.content,
        ' : ',
        els.content
      );
    };

    const node = utils.createNode({
      instance: ast.ConditionExpression,
      kind: SyntaxKind.E.Condition,
      outputStr: utils.mergeString(
        left.node.outputStr!,
        ' extends ',
        right.node.outputStr!,
        ' ? ',
        then.node.outputStr!,
        ' : ',
        els.node.outputStr!
      ),
      left: left.node,
      right: right.node,
      then: then.node,
      else: els.node
    });

    conditionExpressions.native.push({
      content: generateContent(true),
      node
    });

    conditionExpressions.extended.push({
      content: generateContent(false),
      node
    });

    i += 4;
  }

  conditionExpressions.all = [
    ...conditionExpressions.native,
    ...conditionExpressions.extended
  ];

  return conditionExpressions;
})();
