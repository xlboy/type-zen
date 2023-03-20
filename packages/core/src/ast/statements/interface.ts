import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { GenericArgsExpression } from '../expressions/generic-args';
import { IdentifierExpression } from '../expressions/identifier';
import { Object as ObjectExpr } from '../expressions/object';
import { StatementBase } from './base';

export { InterfaceStatement };

const schema = zod.tuple([
  zod.any() /* interface */,
  zod.instanceof(IdentifierExpression),
  zod.instanceof(GenericArgsExpression).or(zod.undefined()),
  zod.instanceof(ObjectExpr.Expression) /* body */
]);

type Schema = zod.infer<typeof schema>;

class InterfaceStatement extends StatementBase {
  public kind = SyntaxKind.S.Interface;

  public name: IdentifierExpression;
  public body: ObjectExpr.Expression;
  public arguments?: GenericArgsExpression;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.name, this.arguments, this.body] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils
      .createNodeFlow('interface')
      .add(' ')
      .add(this.name.compile());

    if (this.arguments) {
      nodeFlow.add(this.arguments.compile());
    }

    nodeFlow.add(this.body.compile());

    return [...this.compiledNodeToPrepend, nodeFlow.get()];
  }

  public toString(): string {
    return this.kind;
  }
}
