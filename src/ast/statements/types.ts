import zod from "zod";
import { ASTBase } from "../base";
import { AST } from "../types";

export { StatementBase };

abstract class StatementBase<S> extends ASTBase<S> {}
