import { Compiler } from "../../../api/compiler";
import { ASTBase } from "../../base";
import { AST } from "../../types";

export { NormalStatementBase };

abstract class NormalStatementBase<S = any> extends ASTBase<S> {
  public abstract compile(): Compiler.Node[];
}
