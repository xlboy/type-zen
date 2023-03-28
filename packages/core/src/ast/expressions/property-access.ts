import * as zod from 'zod';

import type { CompiledNode } from '../../compiler';
import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

export { PropertyAccessExpression };

// Namespace1.A.B.C.E
const schema = zod
  .array(zod.instanceof(IdentifierExpression))
  .or(
    zod.tuple([
      zod.array(zod.instanceof(IdentifierExpression)),
      zod.array(zod.instanceof(ExpressionBase))
    ])
  );

type Schema = zod.infer<typeof schema>;

class PropertyAccessExpression extends ExpressionBase {
  public kind = SyntaxKind.E.PropertyAccess;

  public propertyChain: IdentifierExpression[];
  public genericArguments?: ExpressionBase[];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    if (Array.isArray(args[0])) {
      this.propertyChain = args[0];
      this.genericArguments = args[1] as any;
    } else {
      this.propertyChain = args as any;
    }
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

    if (this.genericArguments) {
      nodeFlow.add('<');

      for (let i = 0; i < this.genericArguments.length; i++) {
        const genericArgument = this.genericArguments[i];

        if (i !== 0) {
          nodeFlow.add(', ');
        }

        nodeFlow.add(genericArgument.compile());
      }

      nodeFlow.add('>');
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
