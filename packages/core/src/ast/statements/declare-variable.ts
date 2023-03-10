import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from '../expressions/base';
import { IdentifierExpression } from '../expressions/identifier';
import { StatementBase } from './base';

export { DeclareVariableStatement };

const commonSchemaTupleSource = [
  zod.any() /* declare */,
  zod.literal('var').or(zod.literal('let')).or(zod.literal('const')),
  zod.instanceof(IdentifierExpression) /* identifier */
] as const;

const schema = zod
  .tuple([...commonSchemaTupleSource, zod.instanceof(ExpressionBase) /* value */])
  .or(zod.tuple([...commonSchemaTupleSource]));

type Schema = zod.infer<typeof schema>;

class DeclareVariableStatement extends StatementBase {
  public kind = SyntaxKind.S.DeclareVariable;

  public declareType: Schema[1];
  public name: IdentifierExpression;
  public value?: ExpressionBase;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    this.declareType = args[1];
    this.name = args[2];
    this.value = args[3];
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add('declare ').add(this.declareType).add(' ').add(this.name.compile());

    if (this.value) {
      nodeFlow.add(': ').add(this.value.compile());
    }

    return [...this.compiledNodeToPrepend, nodeFlow.get()];
  }

  public toString(): string {
    return this.kind;
  }
}
