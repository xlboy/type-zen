import zod from 'zod';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../../expressions/base';
import { NormalStatementBase } from './base';
import { SugarBlockStatement } from './sugar-block';

export { IfStatement };

const commonSchemaTupleSource = [
  zod.any() /* if */,
  zod.object({
    left: zod.instanceof(ExpressionBase),
    right: zod.instanceof(ExpressionBase)
  }) /* condition */,
  zod.instanceof(SugarBlockStatement) /* then */
] as const;

class IfStatement extends NormalStatementBase {
  public kind = SyntaxKind.S.If;

  private static readonly schema = zod
    .tuple([
      ...commonSchemaTupleSource,
      zod.instanceof(SugarBlockStatement).or(zod.instanceof(IfStatement))
    ])
    .or(zod.tuple([...commonSchemaTupleSource]));

  public condition: {
    left: ExpressionBase;
    right: ExpressionBase;
  };
  public then: SugarBlockStatement;
  public else?: SugarBlockStatement | IfStatement;

  constructor(pos: ASTNodePosition, args: any) {
    const _args = args as zod.infer<typeof IfStatement.schema>;

    super(pos);
    this.checkArgs(_args, IfStatement.schema);
    this.initArgs(args);
  }

  private initArgs(args: zod.infer<typeof IfStatement.schema>) {
    this.condition = args[1];
    this.then = args[2];
    this.else = args[3];
  }

  public compile() {
    const nodeFlow = this.compileUtils
      .createNodeFlow(this.condition.left.compile())
      .add(' extends ')
      .add(this.condition.right.compile())
      .add(' ? ')
      .add(this.then.compile())
      .add(' : ');

    if (this.else) {
      nodeFlow.add(this.else.compile());
    } else {
      // 从后往前遍历，看看“当前节点”是否在“前节点”（糖块）中的最后面
      // 如果是，则证明后面还有逻辑链要处理，添加 UnreturnedSymbol
      // 如不是，则证明后面没有逻辑链要处理，则添加 never 进行返回
      // nodeFlow.add(this.compileUtils.getConstants().UnreturnedSymbol);
      const compileChain = this.compileUtils.getChain();
      let i = compileChain.length - 1;
      let isLastNodeInContextSugarBlock = false;

      while (i >= 0) {
        const prevNode = compileChain.at(i - 1);

        if (
          !(prevNode instanceof SugarBlockStatement || prevNode instanceof IfStatement)
        ) {
          break;
        }

        if (prevNode instanceof SugarBlockStatement) {
          const lastStmt = prevNode.statements.at(-1);
          const currentNode = compileChain.at(i);

          // 本语句节点是前一个糖块中的最后一个
          if (currentNode === lastStmt) {
            isLastNodeInContextSugarBlock = true;
          } else {
            isLastNodeInContextSugarBlock = false;
            break;
          }
        }

        i--;
      }

      if (isLastNodeInContextSugarBlock) {
        nodeFlow.add('never');
      } else {
        nodeFlow.add(this.compileUtils.getConstants().UnreturnedSymbol);
      }
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
