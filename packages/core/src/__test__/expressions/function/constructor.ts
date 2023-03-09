import * as ast from '../../../ast';
import * as utils from '../../utils';
import type { Expression } from '../';
import { arrowExpressions } from './arrow';

export { expressions as constructorExpressions };

const expressions: Expression[] = arrowExpressions.map(expr => {
  return {
    content: `new ${expr.content}`,
    node: utils.createNode({
      instance: ast.Function.Mode.ConstructorExpression,
      outputStr: `new ${expr.node.outputStr}`,
      body: expr.node
    })
  };
});
