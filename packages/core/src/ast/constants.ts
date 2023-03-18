export { SyntaxKind };

namespace SyntaxKind {
  // Expression
  export enum E {
    Union = 'Union',
    Intersection = 'Intersection',
    Identifier = 'Identifier',
    LiteralKeyword = 'LiteralKeyword',

    StringLiteral = 'StringLiteral',
    TemplateString = 'TemplateString',

    NumberLiteral = 'NumberLiteral',
    TypeReference = 'TypeReference',
    BracketSurround = 'BracketSurround',
    Condition = 'Condition',
    Infer = 'Infer',
    Keyof = 'Keyof',
    Typeof = 'Typeof',
    GenericArgs = 'GenericArgs',
    GetKeyValue = 'GetKeyValue',
    Tuple = 'Tuple',
    Array = 'Array',

    FunctionBody = 'FunctionBody',
    FunctionReturn = 'FunctionReturn',
    FunctionArrow = 'FunctionArrow',
    FunctionNormal = 'FunctionNormal',
    FunctionConstructor = 'FunctionConstructor',

    Object = 'Object',
    ObjectMapped = 'ObjectMapped',
    ObjectMethod = 'ObjectMethod',
    ObjectNormal = 'ObjectNormal',
    ObjectNameOnly = 'ObjectNameOnly',
    ObjectIndexSignature = 'ObjectIndexSignature',
    ObjectLiteralIndex = 'ObjectLiteralIndex',
    EnumMember = 'EnumMember',

    SugarBlock = 'SugarBlock',
    SugarBlockIf = 'SugarBlockIf',
    SugarBlockFor = 'SugarBlockFor',
    SugarBlockReturn = 'SugarBlockReturn'
  }

  // Statement
  export enum S {
    TypeAlias = 'TypeAlias',
    DeclareVariable = 'DeclareVariable',
    DeclareFunction = 'DeclareFunction',
    Enum = 'Enum'
  }
}
