import moo from "moo";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { Compiler } from "../../api/compiler";

export { IdentifierExpression };

class IdentifierExpression extends ExpressionBase {
  public kind = AST.SyntaxKind.E.Identifier;

  public value: string;

  constructor(pos: AST.Position, args: [moo.Token]) {
    super(pos);
    this.value = args[0].value;
  }

  public compile() {
    return Compiler.Utils.createNodeFlow(this.value, this.pos).get();
  }

  public toString(): string {
    return this.kind;
  }
}
