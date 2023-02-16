import { AST } from "./types";
import zod from "zod";

export { ASTBase };

abstract class ASTBase<S = any> {
  public pos: AST.Position;
  public abstract kind: AST.SyntaxKind.E | AST.SyntaxKind.S;
  public abstract schema: zod.Schema<S>;
  private args: S;

  constructor(pos: AST.Position, args: S) {
    this.pos = pos;
    this.args = args;
    this.checkArgs();
  }

  /**
   * @returns 返回编译后的代码
   */
  public abstract compile(): string;

  /**
   * @returns 返回节点的名称
   */
  public abstract toString(): string;

  public checkArgs() {
    this.schema.parse(this.args);
  }
}
