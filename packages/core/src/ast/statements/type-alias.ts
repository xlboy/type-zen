import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from '../expressions/base';
import { GenericArgsExpression } from '../expressions/generic-args';
import { IdentifierExpression } from '../expressions/identifier';
import { StatementBase } from './base';

export { TypeAliasStatement };

const schema = zod.tuple([
  zod.any() /* type */,
  zod.instanceof(IdentifierExpression),
  zod.instanceof(GenericArgsExpression).or(zod.undefined()),
  zod.instanceof(ExpressionBase) /* value */
]);

type Schema = zod.infer<typeof schema>;

class TypeAliasStatement extends StatementBase {
  public kind = SyntaxKind.S.TypeAlias;

  public name: IdentifierExpression;
  public value: ExpressionBase;
  public arguments?: GenericArgsExpression;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.name, this.arguments, this.value] = args;
  }

  public compile() {
    const nodes = this.compileUtils
      .createNodeFlow('type')
      .add(' ')
      .add(this.name.compile());

    if (this.arguments) {
      nodes.add(this.arguments.compile());
    }

    nodes.add(' = ').add(this.value.compile());

    return [...this.compiledNodeToPrepend, nodes.get()];
  }

  public toString(): string {
    return this.kind;
  }
}
