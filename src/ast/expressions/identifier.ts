import moo from 'moo';
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { IdentifierExpression };

class IdentifierExpression extends ExpressionBase {
  public kind = AST.SyntaxKind.E.Identifier;

  private value: string;

  constructor(pos: AST.Position, [mooToken]: [moo.Token]) {
    super(pos);
    this.value = mooToken.value;
  }

  public compile(): string {
    return this.value;
  }

  public toString(): string {
    return this.kind;
  }
}
