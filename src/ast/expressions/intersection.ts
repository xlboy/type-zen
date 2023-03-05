import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { IntersectionExpression };

const schema = zod
  .tuple([zod.array(zod.instanceof(ExpressionBase))])
  .or(
    zod.tuple([
      zod.any() /* & */,
      zod.array(zod.instanceof(ExpressionBase)),
      zod.any() /* ] */
    ])
  );

type Schema = zod.infer<typeof schema>;

class IntersectionExpression extends ExpressionBase {
  public kind = SyntaxKind.E.Intersection;

  public isExtended: boolean;
  public values: Array<ExpressionBase>;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    if (args.length === 1) {
      this.isExtended = false;
      this.values = args[0];
    } else {
      this.isExtended = true;
      this.values = args[1];
    }
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    for (let i = 0; i < this.values.length; i++) {
      if (i !== 0) {
        nodeFlow.add(' & ');
      }

      nodeFlow.add(this.values[i].compile());
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
