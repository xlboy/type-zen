import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

export { TupleExpression };

// [1, 2, 3, "", "a", Array[number]]
const schema = zod.tuple([
  zod.any() /* [ */,
  zod.array(
    zod.object({
      id: zod.instanceof(IdentifierExpression).or(zod.literal(false)),
      type: zod.instanceof(ExpressionBase),
      optional: zod.boolean(),
      deconstruction: zod.boolean() /* ... */
    })
  ) /* 1, 2, 3, ...items */,
  zod.any() /* ] */
]);

type Schema = zod.infer<typeof schema>;

class TupleExpression extends ExpressionBase {
  public kind = SyntaxKind.E.Tuple;

  public values: Schema[1];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.values] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add('[');

    for (let i = 0; i < this.values.length; i++) {
      if (i !== 0) {
        nodeFlow.add(', ');
      }

      const v = this.values[i];

      if (v.deconstruction) nodeFlow.add('...');
      if (v.id) {
        nodeFlow.add(v.id.compile());
        if (!v.deconstruction && v.optional) nodeFlow.add('?');
        nodeFlow.add(': ');
      }

      nodeFlow.add(v.type.compile());
      if (!v.id && v.optional && !v.deconstruction) nodeFlow.add('?');
    }

    nodeFlow.add(']');

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}

type a = [a: string, b: string];
