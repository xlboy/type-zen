import type * as moo from 'moo';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../base';

export { LiteralKeywordExpression };

class LiteralKeywordExpression extends ExpressionBase {
  public kind = SyntaxKind.E.LiteralKeyword;
  private value: string;

  constructor(pos: ASTNodePosition, [mooToken]: [token: moo.Token]) {
    super(pos);
    this.value = mooToken.value;
  }

  public compile() {
    return this.compileUtils.createNodeFlow(this.value, this.pos).get();
  }

  public toString(): string {
    return `${this.value[0].toLocaleUpperCase()}${this.value.substring(1)}Keyword`;
  }
}
