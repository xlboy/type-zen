import { AST } from "../types";
import { ExpressionBase } from "./types";

export { UnionExpression };

class UnionExpression extends ExpressionBase {
  public kind = AST.SyntaxKind.E.Union;

  constructor(pos: AST.Position) {
    super(pos);
  }

  public compile(): string {
    throw new Error("Method not implemented.");
  }

  public toString(): string {
    return this.kind
  }
}
