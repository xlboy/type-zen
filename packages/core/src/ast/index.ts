export { ASTBase } from './base';

export * from './expressions';
export * from './statements';
export * as exprNode from './expressions';
export * as stmtNode from './statements';
export * as nodeGuard from './utils/node-guard';

export { SyntaxKind } from './constants';

export interface ASTNodePosition {
  start: { line: number; col: number };
  end: { line: number; col: number };
}
