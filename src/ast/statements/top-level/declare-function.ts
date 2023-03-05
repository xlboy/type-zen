import zod from 'zod';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { Function } from '../../expressions/function';
import { IdentifierExpression } from '../../expressions/identifier';
import { TopLevelStatementBase } from './base';

export { DeclareFunctionStatement };

const commonSchemaTupleSource = [
  zod.any() /* declare */,
  zod.instanceof(IdentifierExpression) /* identifier */
] as const;

const schema = zod
  .tuple([
    ...commonSchemaTupleSource,
    zod.instanceof(Function.Mode.NormalExpression) /* value */
  ])
  .or(zod.tuple([...commonSchemaTupleSource]));

type Schema = zod.infer<typeof schema>;

class DeclareFunctionStatement extends TopLevelStatementBase {
  public kind = SyntaxKind.S.DeclareFunction;

  public name: IdentifierExpression;
  public body?: Function.Mode.NormalExpression;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    this.name = args[1];
    this.body = args[2];
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add('declare function ').add(this.name.compile());

    if (this.body) {
      nodeFlow.add(this.body.compile());
    }

    return [...this.compiledNodeToPrepend, nodeFlow.get()];
  }

  public toString(): string {
    return this.kind;
  }
}
