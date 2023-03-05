import type { CompiledNode } from '../../../compiler';
import { ASTBase } from '../../base';

export { TopLevelStatementBase };

// 顶层语句基类
// ----------------------------------------
// 与「普通语句」的主要不同点在于：编译后的结果
// ----------------------------------------
// 顶层语句的编译结果可能包含“一个或多个「普通语句」”。
// 默认情况下，它只包含一个「普通语句」（即顶层语句本身）。
// 但在编译运行时，内部的节点可能会通过一些奇技淫巧（“黑魔法”）来将“编译后的节点”插入到顶层语句的头部前面（例如糖块中具有“类型提升”的语句们）。
abstract class TopLevelStatementBase extends ASTBase {
  protected compiledNodeToPrepend: CompiledNode[][] = [];

  public prependCompiledNode(nodes: CompiledNode[]) {
    this.compiledNodeToPrepend.push(nodes);
  }

  public abstract compile(): CompiledNode[][];
}
