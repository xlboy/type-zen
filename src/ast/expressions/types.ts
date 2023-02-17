import zod from "zod";
import { ASTBase } from "../base";
import { AST } from "../types";

export { ExpressionBase };

abstract class ExpressionBase<S = any> extends ASTBase<S> {}
