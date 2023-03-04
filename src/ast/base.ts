import { ReadonlyDeep } from "type-fest";
import zod from "zod";
import { AST } from "./types";

export { ASTBase };

const compileStack: ASTBase[] = [];

abstract class ASTBase<S = any> {
  public pos: AST.Position;

  public abstract kind: AST.SyntaxKind.E | AST.SyntaxKind.S;

  constructor(pos: AST.Position) {
    this.pos = pos;
    this.compile = this.rewriteCompile();
  }

  /**
   * @returns 返回编译后的代码
   */
  public abstract compile(...args: any[]): any;

  /**
   * @returns 返回节点的名称
   */
  public abstract toString(): string;

  protected getCompileChain(): ReadonlyDeep<ASTBase>[] {
    return compileStack;
  }

  protected checkArgs(args: S, schema: zod.Schema<S>) {
    try {
      schema.parse(args);
    } catch (error) {
      console.error(
        new Error(
          `Invalid args for [${this.kind}] at ${this.pos.start.line}:${this.pos.start.col}`
        )
      );
      throw error;
    }
  }

  private rewriteCompile() {
    const oldCompileFn = this.compile.bind(this);
    const fn = () => {
      compileStack.push(this);
      const compileResult = oldCompileFn();
      compileStack.pop();
      return compileResult;
    };

    return fn as typeof this.compile;
  }
}
