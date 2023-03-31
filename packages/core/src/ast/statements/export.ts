import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { IdentifierExpression } from '../expressions/identifier';
import { StringLiteralExpression } from '../expressions/literals/string';
import { StatementBase } from './base';

export { Export };

namespace Export {
  export class NamedStatement extends StatementBase {
    public kind = SyntaxKind.S.ExportNamed;
    static readonly schema = zod.tuple([
      zod.any() /* export */,
      zod.instanceof(StatementBase) /* body */
    ]);

    public body: StatementBase;

    constructor(pos: ASTNodePosition, args: zod.infer<typeof NamedStatement.schema>) {
      super(pos);
      this.checkArgs(args, NamedStatement.schema);
      [, this.body] = args;
    }

    public compile() {
      const nodeFlow = this.compileUtils.createNodeFlow();
      const bodyCompiledNodeGroup = this.body.compile();

      nodeFlow.add('export ').add(bodyCompiledNodeGroup.at(-1) || []);

      return [
        ...this.compiledNodeToPrepend,
        // 将 body 中具有“提升性质”的语句挪到 export 语句之前
        ...bodyCompiledNodeGroup.slice(0, -1),
        nodeFlow.get()
      ];
    }

    public toString(): string {
      return this.kind;
    }
  }

  export class DefaultStatement extends StatementBase {
    public kind = SyntaxKind.S.ExportDefault;
    static readonly schema = zod.tuple([
      zod.any() /* export */,
      zod.instanceof(IdentifierExpression)
    ]);

    public name: IdentifierExpression;

    constructor(pos: ASTNodePosition, args: zod.infer<typeof DefaultStatement.schema>) {
      super(pos);
      this.checkArgs(args, DefaultStatement.schema);
      [, this.name] = args;
    }

    public compile() {
      const nodeFlow = this.compileUtils
        .createNodeFlow('export default ')
        .add(this.name.compile());

      return [...this.compiledNodeToPrepend, nodeFlow.get()];
    }

    public toString(): string {
      return this.kind;
    }
  }

  const _aggregationSchema = zod.array(
    zod.object({
      id: zod.instanceof(IdentifierExpression),
      type: zod.optional(zod.literal(true)),
      asTarget: zod.optional(zod.instanceof(IdentifierExpression))
    })
  );

  export class MultipleNamedStatement extends StatementBase {
    public kind = SyntaxKind.S.ExportMultipleNamed;
    static readonly schema = zod.tuple([
      zod.any() /* export */,
      zod.object({
        type: zod.optional(zod.literal(true)),
        aggregation: _aggregationSchema
      }),
      zod.any() /* } */
    ]);

    public hasType: boolean;
    public aggregation: zod.infer<typeof _aggregationSchema>;

    constructor(
      pos: ASTNodePosition,
      args: zod.infer<typeof MultipleNamedStatement.schema>
    ) {
      super(pos);
      this.checkArgs(args, MultipleNamedStatement.schema);
      this.hasType = !!args[1].type;
      this.aggregation = args[1].aggregation;
    }

    public compile() {
      const nodeFlow = this.compileUtils.createNodeFlow('export ');

      if (this.hasType) {
        nodeFlow.add('type ');
      }

      if (this.aggregation.length === 0) {
        nodeFlow.add('{}');
      } else {
        nodeFlow.add('{ ');
        for (let i = 0; i < this.aggregation.length; i++) {
          const item = this.aggregation[i];

          if (i !== 0) {
            nodeFlow.add(', ');
          }

          if (item.type) {
            nodeFlow.add('type ');
          }

          nodeFlow.add(item.id.compile());

          if (item.asTarget) {
            nodeFlow.add(' as ').add(item.asTarget.compile());
          }
        }

        nodeFlow.add(' }');
      }

      return [...this.compiledNodeToPrepend, nodeFlow.get()];
    }

    public toString(): string {
      return this.kind;
    }
  }

  export class ReStatement extends StatementBase {
    public kind = SyntaxKind.S.ExportRe;
    static readonly schema = zod.tuple([
      zod.any() /* export */,
      zod.object({
        type: zod.optional(zod.literal(true)),
        asTarget: zod.optional(zod.instanceof(IdentifierExpression)),
        aggregation: zod.optional(_aggregationSchema)
      }),
      zod.instanceof(StringLiteralExpression) /* path */
    ]);

    public sourcePath: StringLiteralExpression;
    public content: zod.infer<typeof ReStatement.schema>[1];

    constructor(pos: ASTNodePosition, args: zod.infer<typeof ReStatement.schema>) {
      super(pos);
      this.checkArgs(args, ReStatement.schema);
      [, this.content, this.sourcePath] = args;
    }

    public compile() {
      const nodeFlow = this.compileUtils.createNodeFlow('export ');

      if (this.content.type) {
        nodeFlow.add('type ');
      }

      if (this.content.aggregation) {
        if (this.content.aggregation.length === 0) {
          nodeFlow.add('{}');
        } else {
          nodeFlow.add('{ ');

          this.content.aggregation.forEach((item, i) => {
            if (i > 0) {
              nodeFlow.add(', ');
            }

            if (item.type) {
              nodeFlow.add('type ');
            }

            nodeFlow.add(item.id.compile());

            if (item.asTarget) {
              nodeFlow.add(' as ').add(item.asTarget.compile());
            }
          });

          nodeFlow.add(' }');
        }
      } else {
        nodeFlow.add('*');

        if (this.content.asTarget) {
          nodeFlow.add(' as ').add(this.content.asTarget.compile());
        }
      }

      nodeFlow.add(' from ').add(this.sourcePath.compile());

      return [...this.compiledNodeToPrepend, nodeFlow.get()];
    }

    public toString(): string {
      return this.kind;
    }
  }
}
