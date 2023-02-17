import { AST } from "./types";
import zod from "zod";

export { ASTBase };

abstract class ASTBase<S = any> {
  public pos: AST.Position;
  public abstract kind: AST.SyntaxKind.E | AST.SyntaxKind.S;

  constructor(pos: AST.Position) {
    this.pos = pos;
  }

  /**
   * @returns 返回编译后的代码
   */
  public abstract compile(): string;

  /**
   * @returns 返回节点的名称
   */
  public abstract toString(): string;

  protected checkArgs(args: S, schema: zod.Schema<S>) {
    schema.parse(args);
  }
}
