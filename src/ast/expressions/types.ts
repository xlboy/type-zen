import { AST, ASTBase } from "../types";

export { ExpressionBase };

abstract class ExpressionBase extends ASTBase {
  constructor(pos: AST.Position) {
    super(pos);
  }
}
