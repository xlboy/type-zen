import { Compiler } from "../../api/compiler";
import { ASTBase } from "../base";
import { AST } from "../types";

export { ExpressionBase };

abstract class ExpressionBase<S = any> extends ASTBase<S> {
  public abstract compile(): Compiler.Node[];
}
