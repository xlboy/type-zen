import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { IdentifierExpression } from '../expressions/identifier';
import { StringLiteralExpression } from '../expressions/literals/string';
import { StatementBase } from './base';

export { ImportStatement };

const aggregationSchema = zod.array(
  zod.object({
    id: zod.instanceof(IdentifierExpression),
    type: zod.optional(zod.literal(true)),
    asTarget: zod.optional(zod.instanceof(IdentifierExpression))
  })
);

const schema = zod.tuple([
  zod.any() /* import */,
  zod.object({
    type: zod.optional(zod.literal(true)),
    id: zod.optional(zod.instanceof(IdentifierExpression)),
    aggregation: zod.optional(aggregationSchema),
    asTarget: zod.optional(zod.instanceof(IdentifierExpression))
  }),
  zod.instanceof(StringLiteralExpression)
]);

type Schema = zod.infer<typeof schema>;

class ImportStatement extends StatementBase {
  public kind = SyntaxKind.S.Import;

  public content: Schema[1];
  public sourcePath: StringLiteralExpression;

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.content, this.sourcePath] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow('import ');

    if (this.content.type) {
      nodeFlow.add('type ');
    }

    if (this.content.asTarget) {
      nodeFlow.add('* as ');
      nodeFlow.add(this.content.asTarget.compile());
    }

    if (this.content.id) {
      nodeFlow.add(this.content.id.compile());
    }

    if (this.content.aggregation) {
      if (this.content.id) {
        nodeFlow.add(', ');
      }

      if (this.content.aggregation.length === 0) {
        nodeFlow.add('{}');
      } else {
        nodeFlow.add('{ ');
        this.content.aggregation.forEach((item, index) => {
          if (index > 0) {
            nodeFlow.add(', ');
          }

          if (item.type) {
            nodeFlow.add('type ');
          }

          nodeFlow.add(item.id.compile());
          if (item.asTarget) {
            nodeFlow.add(' as ');
            nodeFlow.add(item.asTarget.compile());
          }
        });
        nodeFlow.add(' }');
      }
    }

    nodeFlow.add(' from ');
    nodeFlow.add(this.sourcePath.compile());

    return [...this.compiledNodeToPrepend, nodeFlow.get()];
  }

  public toString(): string {
    return this.kind;
  }
}
