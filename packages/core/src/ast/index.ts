export { ASTBase } from './base';

export { ArrayExpression } from './expressions/array';
export { BracketSurroundExpression } from './expressions/bracket-surround';
export { ConditionExpression, InferExpression } from './expressions/condition';
export { Function } from './expressions/function';
export { GenericArgsExpression } from './expressions/generic-args';
export { ElementAccessExpression } from './expressions/element-access';
export { PropertyAccessExpression } from './expressions/property-access';
export { IdentifierExpression } from './expressions/identifier';
export { IntersectionExpression } from './expressions/intersection';
export { KeyofExpression } from './expressions/keyof';
export { LiteralKeywordExpression } from './expressions/literals/keyword';
export { NumberLiteralExpression } from './expressions/literals/number';
export { StringLiteralExpression } from './expressions/literals/string';
export { TemplateStringExpression } from './expressions/template-string';
export { Object } from './expressions/object';
export { TupleExpression } from './expressions/tuple';
export { TypeReferenceExpression } from './expressions/type-reference';
export { UnionExpression } from './expressions/untion';

export { SugarBlockExpression } from './expressions/sugar-block/sugar-block';
export { SugarBlockIfExpression } from './expressions/sugar-block/if';
export { SugarBlockForExpression } from './expressions/sugar-block/for';
export { SugarBlockReturnExpression } from './expressions/sugar-block/return';

export { DeclareFunctionStatement } from './statements/declare-function';
export { DeclareVariableStatement } from './statements/declare-variable';
export { EnumMemberExpression, EnumStatement } from './statements/enum';
export { TypeAliasStatement } from './statements/type-alias';
export { InterfaceStatement } from './statements/interface';

export { StatementBase } from './statements/base';
export { ExpressionBase } from './expressions/base';

export { SyntaxKind } from './constants';

export interface ASTNodePosition {
  start: { line: number; col: number };
  end: { line: number; col: number };
}
