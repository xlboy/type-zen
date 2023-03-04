import zod from "zod";
import { IdentifierExpression } from "../../expressions/identifier";
import { NumberLiteralExpression } from "../../expressions/literals/number";
import { StringLiteralExpression } from "../../expressions/literals/string";
import { AST } from "../../types";
import { TopLevelStatementBase } from "./base";
import { ExpressionBase } from "../../expressions/base";

export { EnumMemberExpression, EnumStatement };

class EnumMemberExpression extends ExpressionBase {
  public kind = AST.SyntaxKind.E.EnumMember;

  private static readonly schema = zod
    .tuple([
      zod.instanceof(IdentifierExpression),
      // TODO：待完善，此处甚至可以为JS的表达式…
      zod
        .instanceof(NumberLiteralExpression)
        .or(zod.instanceof(StringLiteralExpression)),
    ])
    .or(zod.tuple([zod.instanceof(IdentifierExpression)]));

  public name: IdentifierExpression;
  public value?: NumberLiteralExpression | StringLiteralExpression;

  constructor(
    pos: AST.Position,
    args: zod.infer<typeof EnumMemberExpression.schema>
  ) {
    super(pos);
    this.checkArgs(args, EnumMemberExpression.schema);
    [this.name, this.value] = args;
  }

  public compile(): string {
    let str = this.name.compile();

    if (this.value) str += ` = ${this.value.compile()}`;

    return str;
  }
  public toString(): string {
    return this.kind;
  }
}

class EnumStatement extends TopLevelStatementBase {
  public kind = AST.SyntaxKind.S.Enum;

  private static readonly schema = zod.tuple([
    zod.any() /* enum/const - moo.Token */,
    zod.instanceof(IdentifierExpression),
    zod.array(zod.instanceof(EnumMemberExpression)),
    zod.any() /* } */,
  ]);

  public name: IdentifierExpression;
  public members: EnumMemberExpression[];
  private isConstDeclare: boolean;

  constructor(pos: AST.Position, args: zod.infer<typeof EnumStatement.schema>) {
    super(pos);
    this.checkArgs(args, EnumStatement.schema);

    const firstToken = args[0] as moo.Token;
    this.isConstDeclare = firstToken.value === "const";

    [, this.name, this.members] = args;
  }

  public compile(): string {
    let str = `enum ${this.name.compile()} {`;

    if (this.members.length === 0) {
      str += `};`;
    } else {
      str += `\n`;
      for (const member of this.members) {
        str += `  ${member.compile()};\n`;
      }
      str += `};`;
    }

    if (this.isConstDeclare) str = `const ${str}`;

    return str;
  }
  public toString(): string {
    return this.kind;
  }
}
