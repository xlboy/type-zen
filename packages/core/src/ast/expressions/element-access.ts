import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { ElementAccessExpression };

// CustomObject["a"]
const schema = zod.tuple([
  zod.instanceof(ExpressionBase) /* CustomObject */,
  zod.any() /* [ */,
  zod.instanceof(ExpressionBase) /* "a" */,
  zod.any() /* ] */
]);

type Schema = zod.infer<typeof schema>;

class ElementAccessExpression extends ExpressionBase {
  public kind = SyntaxKind.E.ElementAccess;

  public source: ExpressionBase;
  public key: ExpressionBase;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.source, , this.key] = args;
  }

  public compile() {
    return this.compileUtils
      .createNodeFlow(this.source.compile())
      .add('[')
      .add(this.key.compile())
      .add(']')
      .get();
  }

  public toString(): string {
    return this.kind;
  }
}
