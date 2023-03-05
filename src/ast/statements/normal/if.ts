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
      zod
        .instanceof(SugarBlockStatement)
        .or(zod.instanceof(IfStatement))
        .or(zod.undefined()) /* else */
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
      nodeFlow.add(this.compileUtils.getConstants().UnreturnedSymbol);
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
