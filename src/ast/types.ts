export { ASTBase, AST };

namespace AST {
  export interface Position {
    start: { line: number; col: number };
    end: { line: number; col: number };
  }

  export namespace SyntaxKind {
    // Expression
    export enum E {
      Union = "ValueDeclaration",
      ValueKeyword = "ValueKeyword"
    }
    // Statement
    export enum S {
      TypeDeclaration = "TypeDeclaration",
    }
  }
}

abstract class ASTBase {
  public pos: AST.Position;
  protected abstract kind: AST.SyntaxKind.E | AST.SyntaxKind.S;

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
}
