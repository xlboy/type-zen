import type { CompiledNode } from '../../compiler/types';
import { ASTBase } from '../base';

export { ExpressionBase };

abstract class ExpressionBase extends ASTBase {
  public abstract compile(): CompiledNode[];
}
