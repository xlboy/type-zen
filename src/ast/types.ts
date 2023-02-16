export { AST };

namespace AST {
  export interface Position {
    start: { line: number; col: number };
    end: { line: number; col: number };
  }

  export namespace SyntaxKind {
    // Expression
    export enum E {
      Union = "ValueDeclaration",
      ValueKeyword = "ValueKeyword",
      Identifier = "Identifier",
      StringLiteral = "StringLiteral",
      NumberLiteral = "NumberLiteral",
      
    }
    // Statement
    export enum S {
      TypeDeclaration = "TypeDeclaration",
    }
  }
}
