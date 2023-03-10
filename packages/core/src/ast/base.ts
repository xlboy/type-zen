import type * as zod from 'zod';

import { ASTCompileBase } from '../compiler';
import type { ASTNodePosition } from './';
import type { SyntaxKind } from './constants';

export { ASTBase };

abstract class ASTBase extends ASTCompileBase {
  public pos: ASTNodePosition;

  public abstract kind: SyntaxKind.E | SyntaxKind.S;

  constructor(pos: ASTNodePosition) {
    super();
    this.pos = pos;
  }

  /**
   * @returns 返回节点的名称
   */
  public abstract toString(): string;

  protected checkArgs<T>(args: T, schema: zod.Schema<T>) {
    try {
      schema.parse(args);
    } catch (error) {
      console.error(
        new Error(
          `Invalid args for [${this.kind}] at ${this.pos.start.line}:${this.pos.start.col}`
        )
      );
      throw error;
    }
  }
}
