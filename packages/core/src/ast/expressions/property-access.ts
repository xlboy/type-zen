import * as zod from 'zod';

import type { CompiledNode } from '../../compiler';
import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

export { PropertyAccessExpression };

// Namespace1.A.B.C.E
const schema = zod.array(zod.instanceof(IdentifierExpression));

type Schema = zod.infer<typeof schema>;

class PropertyAccessExpression extends ExpressionBase {
  public kind = SyntaxKind.E.PropertyAccess;

  public propertyChain: IdentifierExpression[];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.propertyChain = args;
  }

  public compile(): CompiledNode[] {
    const nodeFlow = this.compileUtils.createNodeFlow();

    for (let i = 0; i < this.propertyChain.length; i++) {
      const propertyName = this.propertyChain[i];

      if (i !== 0) {
        nodeFlow.add('.');
      }

      nodeFlow.add(propertyName.compile());
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
