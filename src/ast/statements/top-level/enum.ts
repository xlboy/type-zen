import zod from 'zod';

import type { ASTNodePosition } from '../..';
import { SyntaxKind } from '../../constants';
import { ExpressionBase } from '../../expressions/base';
import { IdentifierExpression } from '../../expressions/identifier';
import { NumberLiteralExpression } from '../../expressions/literals/number';
import { StringLiteralExpression } from '../../expressions/literals/string';
import { TopLevelStatementBase } from './base';

export { EnumMemberExpression, EnumStatement };

class EnumMemberExpression extends ExpressionBase {
  public kind = SyntaxKind.E.EnumMember;

  private static readonly schema = zod
    .tuple([
      zod.instanceof(IdentifierExpression),
      // TODO：待完善，此处甚至可以为JS的表达式…
      zod.instanceof(NumberLiteralExpression).or(zod.instanceof(StringLiteralExpression))
    ])
    .or(zod.tuple([zod.instanceof(IdentifierExpression)]));

  public name: IdentifierExpression;
  public value?: NumberLiteralExpression | StringLiteralExpression;

  constructor(pos: ASTNodePosition, args: zod.infer<typeof EnumMemberExpression.schema>) {
    super(pos);
    this.checkArgs(args, EnumMemberExpression.schema);
    [this.name, this.value] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add(this.name.compile());

    if (this.value) {
      nodeFlow.add(' = ').add(this.value.compile());
    }

    return nodeFlow.get();
  }
  public toString(): string {
    return this.kind;
  }
}

class EnumStatement extends TopLevelStatementBase {
  public kind = SyntaxKind.S.Enum;

  private static readonly schema = zod.tuple([
    zod.any() /* enum/const - moo.Token */,
    zod.instanceof(IdentifierExpression),
    zod.array(zod.instanceof(EnumMemberExpression)),
    zod.any() /* } */
  ]);

  public name: IdentifierExpression;
  public members: EnumMemberExpression[];
  private isConstDeclare: boolean;

  constructor(pos: ASTNodePosition, args: zod.infer<typeof EnumStatement.schema>) {
    super(pos);
    this.checkArgs(args, EnumStatement.schema);
    const firstToken = args[0] as moo.Token;

    this.isConstDeclare = firstToken.value === 'const';
    [, this.name, this.members] = args;
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    if (this.isConstDeclare) {
      nodeFlow.add('const ');
    }

    nodeFlow.add('enum ').add(this.name.compile()).add(' {');

    if (this.members.length === 0) {
      nodeFlow.add('}');
    } else {
      nodeFlow.add('\n');
      for (let i = 0; i < this.members.length; i++) {
        const member = this.members[i];

        nodeFlow
          .add(' '.repeat(this.compileUtils.getConfig().indent))
          .add(member.compile());

        if (i !== this.members.length - 1) {
          nodeFlow.add(',');
        }

        nodeFlow.add('\n');
      }

      nodeFlow.add('}');
    }

    return [nodeFlow.get()];
  }
  public toString(): string {
    return this.kind;
  }
}
