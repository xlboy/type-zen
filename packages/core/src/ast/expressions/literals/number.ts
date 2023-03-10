import type * as moo from 'moo';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../base';

export { NumberLiteralExpression };

class NumberLiteralExpression extends ExpressionBase {
  public kind = SyntaxKind.E.NumberLiteral;

  public value: string;

  constructor(pos: ASTNodePosition, [mooToken]: [moo.Token]) {
    super(pos);
    this.value = mooToken.value;
  }

  public compile() {
    return this.compileUtils.createNodeFlow(this.value, this.pos).get();
  }

  public toString(): string {
    return this.kind;
  }
}
