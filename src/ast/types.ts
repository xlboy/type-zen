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
      Intersection = "Intersection",
      Identifier = "Identifier",
      LiteralKeyword = "LiteralKeyword",
      StringLiteral = "StringLiteral",
      NumberLiteral = "NumberLiteral",
      TypeReference = "TypeReference",
      BracketSurround = "BracketSurround",
      Condition = "Condition",
      Infer = "Infer",
      Keyof = "Keyof",
      Typeof = "Typeof",
      GenericArgs = "GenericArgs",
      GetKeyValue = "GetKeyValue",
      Tuple = "Tuple",
      Array = "Array",
      Function_Body = "Function_Body",
      Function_Return = "Function_Return",
      Function_Arrow = "Function_Arrow",
      Function_Normal = "Function_Normal",
      Function_Constructor = "Function_Constructor",
      Object = "Object",
      Object_Mapped = "Object_Mapped",
      Object_Method = "Object_Method",
      Object_Normal = "Object_Normal",
      Object_NameOnly = "Object_NameOnly",
      Object_IndexSignature = "Object_IndexSignature",
      Object_LiteralIndex = "Object_LiteralIndex",
      EnumMember = "EnumMember",
    }
    // Statement
    export enum S {
      TypeAlias = "TypeAlias",
      DeclareVariable = "DeclareVariable",
      DeclareFunction = "DeclareFunction",
      If = "If",
      Enum = "Enum",
      SugarBlock = "SugarBlock",
    }
  }
}
