export { AST };

namespace AST {
  export interface Position {
    start: { line: number; col: number };
    end: { line: number; col: number };
  }

  export namespace SyntaxKind {
    // Expression
    export enum E {
      Union = "Untion",
      ValueKeyword = "ValueKeyword",
      Identifier = "Identifier",
      StringLiteral = "StringLiteral",
      NumberLiteral = "NumberLiteral",
      TypeReference = "TypeReference",
      BracketSurround = "BracketSurround",
      Condition = "Condition",
      TypeDeclarationArgs = "TypeDeclarationArgs",
      GetKeyValue = "GetKeyValue"
    }
    // Statement
    export enum S {
      TypeDeclaration = "TypeDeclaration",
    }
  }
}
