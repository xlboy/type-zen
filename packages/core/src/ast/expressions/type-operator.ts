import type * as moo from 'moo';
import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { TypeOperatorExpression };

const schema = zod.tuple([
  zod.custom<moo.Token>(
    (item: any) => 'value' in item
  ) /* operator(keyof, typeof, readonly) */,
  zod.instanceof(ExpressionBase) /* source */
]);

type Schema = zod.infer<typeof schema>;

class TypeOperatorExpression extends ExpressionBase {
  public kind = SyntaxKind.E.TypeOperator;

  public operator: string;
  public source: ExpressionBase;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.source = args[1];
    this.operator = args[0].value;
  }

  public compile() {
    return this.compileUtils
      .createNodeFlow(this.operator)
      .add(' ')
      .add(this.source.compile())
      .get();
  }

  public toString(): string {
    return this.kind;
  }
}
