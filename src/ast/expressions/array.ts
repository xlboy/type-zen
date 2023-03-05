import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { ArrayExpression };

const schema = zod.tuple([
  zod.instanceof(ExpressionBase),
  zod.any() /* [ */,
  zod.any() /* ] */
]);

type Schema = zod.infer<typeof schema>;

class ArrayExpression extends ExpressionBase {
  public kind = SyntaxKind.E.Array;

  public source: ExpressionBase;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.source] = args;
  }

  public compile() {
    return this.compileUtils.createNodeFlow(this.source.compile()).add('[]').get();
  }

  public toString(): string {
    return this.kind;
  }
}
