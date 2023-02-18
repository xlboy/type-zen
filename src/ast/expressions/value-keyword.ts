import moo from "moo";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { ValueKeywordExpression };

class ValueKeywordExpression extends ExpressionBase {
  public kind = AST.SyntaxKind.E.ValueKeyword;
  private value: string;

  constructor(pos: AST.Position, [mooToken]: [token: moo.Token]) {
    super(pos);
    this.value = mooToken.value;
  }

  public compile(): string {
    return this.value;
  }

  public toString(): string {
    return `${this.value[0].toLocaleUpperCase()}${this.value.substring(1)}Keyword`;
  }
}
