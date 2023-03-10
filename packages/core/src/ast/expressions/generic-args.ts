import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

export { GenericArgsExpression };

const schema = zod.tuple([
  zod.any() /* < */,
  zod.array(
    zod.object({
      id: zod.instanceof(IdentifierExpression),
      type: zod.instanceof(ExpressionBase).or(zod.undefined()).or(zod.null()),
      default: zod.instanceof(ExpressionBase).or(zod.undefined()).or(zod.null())
    })
  ),
  zod.any() /* > */
]);

type Schema = zod.infer<typeof schema>;

class GenericArgsExpression extends ExpressionBase {
  public kind = SyntaxKind.E.GenericArgs;

  public values: Schema[1];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.values] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow('<');

    for (let i = 0; i < this.values.length; i++) {
      const value = this.values[i];

      if (i !== 0) {
        nodeFlow.add(', ');
      }

      nodeFlow.add(value.id.compile());
      if (value.type) {
        nodeFlow.add(` extends `).add(value.type.compile());
      }

      if (value.default) {
        nodeFlow.add(` = `).add(value.default.compile());
      }
    }

    nodeFlow.add('>');

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
