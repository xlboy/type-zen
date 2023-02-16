import { AST, ASTBase } from "../types";

export { StatementBase };

abstract class StatementBase extends ASTBase {
  constructor(pos: AST.Position) {
    super(pos);
  }
}
