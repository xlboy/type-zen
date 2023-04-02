import type { ASTBase } from '../base';
import { SyntaxKind } from '../constants';
import * as expr from '../expressions';
import * as stmt from '../statements';

export const expression = {
  is(node: ASTBase): node is expr.ExpressionBase {
    return node instanceof expr.ExpressionBase;
  },
  isArray(node: ASTBase): node is expr.ArrayExpression {
    return node.kind === SyntaxKind.E.Array;
  },

  isBracketSurround(node: ASTBase): node is expr.BracketSurroundExpression {
    return node.kind === SyntaxKind.E.BracketSurround;
  },

  isCondition(node: ASTBase): node is expr.ConditionExpression {
    return node.kind === SyntaxKind.E.Condition;
  },

  isInfer(node: ASTBase): node is expr.InferExpression {
    return node.kind === SyntaxKind.E.Infer;
  },
  isArrowFunction(node: ASTBase): node is expr.Function.Mode.ArrowExpression {
    return node.kind === SyntaxKind.E.FunctionArrow;
  },

  isConstructor(node: ASTBase): node is expr.Function.Mode.ConstructorExpression<any> {
    return node.kind === SyntaxKind.E.FunctionConstructor;
  },

  isNormalFunction(node: ASTBase): node is expr.Function.Mode.NormalExpression {
    return node.kind === SyntaxKind.E.FunctionNormal;
  },

  isGenericArgs(node: ASTBase): node is expr.GenericArgsExpression {
    return node.kind === SyntaxKind.E.GenericArgs;
  },

  isElementAccess(node: ASTBase): node is expr.ElementAccessExpression {
    return node.kind === SyntaxKind.E.ElementAccess;
  },
  isPropertyAccess(node: ASTBase): node is expr.PropertyAccessExpression {
    return node.kind === SyntaxKind.E.PropertyAccess;
  },
  isIdentifier(node: ASTBase): node is expr.IdentifierExpression {
    return node.kind === SyntaxKind.E.Identifier;
  },
  isIntersection(node: ASTBase): node is expr.IntersectionExpression {
    return node.kind === SyntaxKind.E.Intersection;
  },
  isTypeOperator(node: ASTBase): node is expr.TypeOperatorExpression {
    return node.kind === SyntaxKind.E.TypeOperator;
  },
  isLiteralKeyword(node: ASTBase): node is expr.LiteralKeywordExpression {
    return node.kind === SyntaxKind.E.LiteralKeyword;
  },
  isNumberLiteral(node: ASTBase): node is expr.NumberLiteralExpression {
    return node.kind === SyntaxKind.E.NumberLiteral;
  },
  isStringLiteral(node: ASTBase): node is expr.StringLiteralExpression {
    return node.kind === SyntaxKind.E.StringLiteral;
  },
  isTemplateString(node: ASTBase): node is expr.TemplateStringExpression {
    return node.kind === SyntaxKind.E.TemplateString;
  },
  isObject(node: ASTBase): node is expr.Object.Expression {
    return node.kind === SyntaxKind.E.Object;
  },
  isTuple(node: ASTBase): node is expr.TupleExpression {
    return node.kind === SyntaxKind.E.Tuple;
  },
  isTypeReference(node: ASTBase): node is expr.TypeReferenceExpression {
    return node.kind === SyntaxKind.E.TypeReference;
  },
  isUnion(node: ASTBase): node is expr.UnionExpression {
    return node.kind === SyntaxKind.E.Union;
  },
  isSugarBlock(node: ASTBase): node is expr.SugarBlockExpression {
    return node.kind === SyntaxKind.E.SugarBlock;
  },
  isSugarBlockIf(node: ASTBase): node is expr.SugarBlockIfExpression {
    return node.kind === SyntaxKind.E.SugarBlockIf;
  },
  isSugarBlockFor(node: ASTBase): node is expr.SugarBlockForExpression {
    return node.kind === SyntaxKind.E.SugarBlockFor;
  },
  isSugarBlockReturn(node: ASTBase): node is expr.SugarBlockReturnExpression {
    return node.kind === SyntaxKind.E.SugarBlockReturn;
  },
  isEnumMember(node: ASTBase): node is stmt.EnumMemberExpression {
    return node.kind === SyntaxKind.E.EnumMember;
  }
};

export const statement = {
  is(node: ASTBase): node is stmt.StatementBase {
    return node instanceof stmt.StatementBase;
  },
  isExportDefault(node: ASTBase): node is stmt.Export.DefaultStatement {
    return node.kind === SyntaxKind.S.ExportDefault;
  },

  isExportNamed(node: ASTBase): node is stmt.Export.NamedStatement {
    return node.kind === SyntaxKind.S.ExportNamed;
  },

  isExportMultipleNamed(node: ASTBase): node is stmt.Export.MultipleNamedStatement {
    return node.kind === SyntaxKind.S.ExportMultipleNamed;
  },

  isExportRe(node: ASTBase): node is stmt.Export.ReStatement {
    return node.kind === SyntaxKind.S.ExportRe;
  },

  isImport(node: ASTBase): node is stmt.ImportStatement {
    return node.kind === SyntaxKind.S.Import;
  },

  isDeclareFunction(node: ASTBase): node is stmt.DeclareFunctionStatement {
    return node.kind === SyntaxKind.S.DeclareFunction;
  },

  isDeclareVariable(node: ASTBase): node is stmt.DeclareVariableStatement {
    return node.kind === SyntaxKind.S.DeclareVariable;
  },

  isEnum(node: ASTBase): node is stmt.EnumStatement {
    return node.kind === SyntaxKind.S.Enum;
  },

  isTypeAlias(node: ASTBase): node is stmt.TypeAliasStatement {
    return node.kind === SyntaxKind.S.TypeAlias;
  },

  isInterface(node: ASTBase): node is stmt.InterfaceStatement {
    return node.kind === SyntaxKind.S.Interface;
  }
};
