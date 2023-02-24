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
      Identifier = "Identifier",
      LiteralKeyword = "LiteralKeyword",
      StringLiteral = "StringLiteral",
      NumberLiteral = "NumberLiteral",
      TypeReference = "TypeReference",
      BracketSurround = "BracketSurround",
      Condition = "Condition",
      GenericArgs = "GenericArgs",
      GetKeyValue = "GetKeyValue",
      Tuple = "Tuple",
      Array = "Array",
      FunctionBody = "FunctionBody",
      FunctionReturn = "FunctionReturn",
      ArrowFunction = "ArrowFunction",
      NormalFunction = "NormalFunction",
    }
    // Statement
    export enum S {
      TypeDeclaration = "TypeDeclaration",
    }
  }
}
