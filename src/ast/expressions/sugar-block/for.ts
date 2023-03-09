import zod from 'zod';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../base';
import { IdentifierExpression } from '../identifier';
import { SugarBlockExpression } from './sugar-block';

export { SugarBlockForExpression };

const schema = zod.tuple([
  zod.any() /* for */,
  zod.object({
    name: zod.instanceof(IdentifierExpression),
    source: zod.instanceof(ExpressionBase)
  }) /* mapping */,
  zod.instanceof(SugarBlockExpression) /* body */
]);

type Schema = zod.infer<typeof schema>;

class SugarBlockForExpression extends ExpressionBase {
  public kind = SyntaxKind.E.SugarBlockFor;

  public mapping: {
    name: ExpressionBase;
    source: ExpressionBase;
  };
  public body: SugarBlockExpression;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.mapping, this.body] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils
      .createNodeFlow(this.mapping.source.compile())
      .add(' extends infer ')
      .add(this.mapping.name.compile())
      .add(' ? ')
      .add(this.body.compile())
      .add(' : never');

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
