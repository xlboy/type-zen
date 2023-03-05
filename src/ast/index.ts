export { ASTBase } from './base';

export { ArrayExpression } from './expressions/array';
export { BracketSurroundExpression } from './expressions/bracket-surround';
export { ConditionExpression, InferExpression } from './expressions/condition';
export { Function } from './expressions/function';
export { GenericArgsExpression } from './expressions/generic-args';
export { GetKeyValueExpression } from './expressions/get-key-value';
export { IdentifierExpression } from './expressions/identifier';
export { IntersectionExpression } from './expressions/intersection';
export { KeyofExpression } from './expressions/keyof';
export { LiteralKeywordExpression } from './expressions/literals/keyword';
export { NumberLiteralExpression } from './expressions/literals/number';
export { StringLiteralExpression } from './expressions/literals/string';
export { Object } from './expressions/object';
export { TupleExpression } from './expressions/tuple';
export { TypeReferenceExpression } from './expressions/type-reference';
export { UnionExpression } from './expressions/untion';

export { DeclareFunctionStatement } from './statements/top-level/declare-function';
export { DeclareVariableStatement } from './statements/top-level/declare-variable';
export { EnumMemberExpression, EnumStatement } from './statements/top-level/enum';
export { TypeAliasStatement } from './statements/top-level/type-alias';
export { IfStatement } from './statements/normal/if';
export { ReturnStatement } from './statements/normal/return';
export { SugarBlockStatement } from './statements/normal/sugar-block';

export interface ASTNodePosition {
  start: { line: number; col: number };
  end: { line: number; col: number };
}
