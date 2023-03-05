import type { CompiledNode } from '../../../compiler';
import { ASTBase } from '../../base';

export { NormalStatementBase };

abstract class NormalStatementBase extends ASTBase {
  public abstract compile(): CompiledNode[];
}
