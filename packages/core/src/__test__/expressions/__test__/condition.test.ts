import { describe, it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';
import { conditionExpressions, inferExpressions } from '..';

describe('condition', () => {
  it('native', () => {
    conditionExpressions.native.forEach(expr => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            outputStr: `type A = ${expr.node.outputStr}`,
            value: expr.node
          })
        ]
      });
    });
  });

  it('extended', () => {
    conditionExpressions.extended.forEach(expr => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            outputStr: `type A = ${expr.node.outputStr}`,
            value: expr.node
          })
        ]
      });
    });
  });
});

describe('infer', () => {
  it('native', () => {
    inferExpressions.native.forEach(expr => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            outputStr: `type A = ${expr.node.outputStr}`,
            value: expr.node
          })
        ]
      });
    });
  });

  it('extended', () => {
    inferExpressions.extended.forEach(expr => {
      utils.assertSource({
        content: `type A = ${expr.content}`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            outputStr: `type A = ${expr.node.outputStr}`,
            value: expr.node
          })
        ]
      });
    });
  });
});
