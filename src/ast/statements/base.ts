import type { CompiledNode } from '../../compiler';
import { ASTBase } from '../base';

export { StatementBase };


// 语句的编译结果可能包含“一个或多个「语句」”。
// 默认情况下，它只包含一个「语句」（即其本身）。
// 但在编译运行时，内部的节点可能会通过一些奇技淫巧（“黑魔法”）来将“编译后的节点”插入到某语句的头部前面（例如糖块中具有“类型提升”的语句们）。
abstract class StatementBase extends ASTBase {
  protected compiledNodeToPrepend: CompiledNode[][] = [];

  public prependCompiledNode(nodes: CompiledNode[]) {
    this.compiledNodeToPrepend.push(nodes);
  }

  public abstract compile(): CompiledNode[][];
}
