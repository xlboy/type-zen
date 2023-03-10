import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { KeyofExpression };

const schema = zod.tuple([
  zod.any() /* keyof*/,
  zod.instanceof(ExpressionBase) /* source */
]);

type Schema = zod.infer<typeof schema>;

class KeyofExpression extends ExpressionBase {
  public kind = SyntaxKind.E.Keyof;

  public source: ExpressionBase;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.source = args[1];
  }

  public compile() {
    return this.compileUtils.createNodeFlow('keyof ').add(this.source.compile()).get();
  }

  public toString(): string {
    return this.kind;
  }
}
