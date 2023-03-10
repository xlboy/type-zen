import * as zod from 'zod';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../base';
import { SugarBlockExpression } from './sugar-block';

export { SugarBlockIfExpression };

const commonSchemaTupleSource = [
  zod.any() /* if */,
  zod.object({
    left: zod.instanceof(ExpressionBase),
    right: zod.instanceof(ExpressionBase)
  }) /* condition */,
  zod.instanceof(SugarBlockExpression) /* then */
] as const;

class SugarBlockIfExpression extends ExpressionBase {
  public kind = SyntaxKind.E.SugarBlockIf;

  static readonly schema = zod
    .tuple([
      ...commonSchemaTupleSource,
      zod.instanceof(SugarBlockExpression).or(zod.instanceof(SugarBlockIfExpression))
    ])
    .or(zod.tuple([...commonSchemaTupleSource]));

  public condition: {
    left: ExpressionBase;
    right: ExpressionBase;
  };
  public then: SugarBlockExpression;
  public else?: SugarBlockExpression | SugarBlockIfExpression;

  constructor(pos: ASTNodePosition, args: any) {
    const _args = args as zod.infer<typeof SugarBlockIfExpression.schema>;

    super(pos);
    this.checkArgs(_args, SugarBlockIfExpression.schema);
    this.initArgs(args);
  }

  private initArgs(args: zod.infer<typeof SugarBlockIfExpression.schema>) {
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
      const compileChain = this.compileUtils.getChain();
      let i = compileChain.length - 1;
      let isLastNodeInContextSugarBlock = false;

      while (i >= 0) {
        const prevNode = compileChain.at(i - 1);

        if (
          !(
            prevNode instanceof SugarBlockExpression ||
            prevNode instanceof SugarBlockIfExpression
          )
        ) {
          break;
        }

        if (prevNode instanceof SugarBlockExpression) {
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
