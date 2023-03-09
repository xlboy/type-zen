import * as ast from '../../ast';
import { SyntaxKind } from '../../ast/constants';
import * as utils from '../utils';
import type { Expression } from './';
import { literalExpressions } from './literal';
import { typeReferenceExpressions } from './type-reference';
import { unionExpressions } from './union';

export { expressions as getKeyValueExpressions };

const expressions: Expression[] = [];

typeReferenceExpressions.forEach(ref => {
  literalExpressions.all.forEach(lit => {
    expressions.push({
      content: `${ref.content}[${lit.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: SyntaxKind.E.GetKeyValue,
        outputStr: `${ref.node.outputStr}[${lit.node.outputStr}]`,
        source: ref.node,
        key: lit.node
      })
    });
  });

  typeReferenceExpressions.forEach(ref2 => {
    expressions.push({
      content: `${ref.content}[${ref2.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: SyntaxKind.E.GetKeyValue,
        outputStr: `${ref.node.outputStr}[${ref2.node.outputStr}]`,
        source: ref.node,
        key: ref2.node
      })
    });
  });

  unionExpressions.all.slice(0, 100).forEach(union => {
    expressions.push({
      content: `${ref.content}[${union.content}]`,
      node: utils.createNode({
        instance: ast.GetKeyValueExpression,
        kind: SyntaxKind.E.GetKeyValue,
        outputStr: `${ref.node.outputStr}[${union.node.outputStr}]`,
        source: ref.node,
        key: union.node
      })
    });
  });
});
