import moo from "moo";
import { AST } from "../types";
import { ExpressionBase } from "./types";

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
    return `${this.value}Keyword`;
  }
}
