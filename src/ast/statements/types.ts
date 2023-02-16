import { ASTBase } from "../base";
import { AST } from "../types";

export { StatementBase };

abstract class StatementBase<S> extends ASTBase<S> {
  constructor(pos: AST.Position, args: S) {
    super(pos, args);
  }
}
