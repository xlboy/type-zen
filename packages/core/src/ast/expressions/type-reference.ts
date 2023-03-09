import zod from 'zod';

import type { CompiledNode } from '../../compiler';
import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

export { TypeReferenceExpression };

const schema = zod
  .tuple([zod.instanceof(IdentifierExpression)])
  .or(
    zod.tuple([
      zod.instanceof(IdentifierExpression),
      zod.any() /* < */,
      zod.array(zod.instanceof(ExpressionBase)),
      zod.any() /* > */
    ])
  );

type Schema = zod.infer<typeof schema>;

class TypeReferenceExpression extends ExpressionBase {
  public kind = SyntaxKind.E.TypeReference;

  public name: IdentifierExpression;
  public arguments: Array<ExpressionBase> = [];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.name] = args;
    if (args.length > 1) {
      if (args[2]) this.arguments = args[2];
    }
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add(this.getRealName());

    if (this.arguments.length === 0) {
      return nodeFlow.get();
    }

    nodeFlow.add('<');

    for (let i = 0; i < this.arguments.length; i++) {
      if (i !== 0) {
        nodeFlow.add(', ');
      }

      nodeFlow.add(this.arguments[i].compile());
    }

    nodeFlow.add('>');

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }

  private getRealName(): CompiledNode[] {
    const nearestSugarBlockStmt = this.compileUtils.getNearestSugarBlockExpr();

    if (nearestSugarBlockStmt) {
      const outputName = nearestSugarBlockStmt.toHoistIdentifierMap.get(this.name.value);

      if (outputName) {
        return [{ text: outputName, pos: {} }];
      }
    }

    return this.name.compile();
  }
}
