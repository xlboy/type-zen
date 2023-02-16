import { ASTBase } from "../base";
import { AST } from "../types";

export { ExpressionBase };

abstract class ExpressionBase<S> extends ASTBase<S> {
  constructor(pos: AST.Position, args: S) {
    super(pos, args);
  }
}
