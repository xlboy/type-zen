import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';

export { TemplateStringExpression };

const schema = zod.tuple([
  zod.any() /* ` */,
  zod.array(
    zod
      .instanceof(ExpressionBase) /* ${xxxx} */
      .or(zod.string())
  ),
  zod.any() /* ` */
]);

type Schema = zod.infer<typeof schema>;

class TemplateStringExpression extends ExpressionBase {
  public kind = SyntaxKind.E.TemplateString;

  public values: Schema[1];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.values] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add('`');
    for (const value of this.values) {
      if (value instanceof ExpressionBase) {
        nodeFlow.add('${').add(value.compile()).add('}');
      } else {
        nodeFlow.add(value);
      }
    }

    nodeFlow.add('`');

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
