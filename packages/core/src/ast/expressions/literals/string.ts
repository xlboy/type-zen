import type moo from 'moo';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../base';

export { StringLiteralExpression };

class StringLiteralExpression extends ExpressionBase {
  public kind = SyntaxKind.E.StringLiteral;

  public value: string;

  constructor(pos: ASTNodePosition, args: [moo.Token]) {
    super(pos);
    this.value = args[0].value;
  }

  public compile() {
    return this.compileUtils.createNodeFlow(this.value, this.pos).get();
  }

  public toString(): string {
    return this.kind;
  }
}
