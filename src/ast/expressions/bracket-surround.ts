import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { BracketSurroundExpression };

const schema = zod.tuple([
  zod.any() /* ( */,
  zod.instanceof(ExpressionBase),
  zod.any() /* ) */
]);

type Schema = zod.infer<typeof schema>;

class BracketSurroundExpression extends ExpressionBase {
  public kind = SyntaxKind.E.BracketSurround;

  public value: ExpressionBase;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.value] = args;
  }

  public compile() {
    return this.compileUtils.createNodeFlow('(').add(this.value.compile()).add(')').get();
  }

  public toString(): string {
    return this.kind;
  }
}
