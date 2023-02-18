import zod from "zod";
import { IdentifierExpression } from "../expressions/identifier";
import { ExpressionBase } from "../expressions/base";
import { AST } from "../types";
import { StatementBase } from "./base";

export { TypeDeclarationStatement };

class TypeDeclarationStatement extends StatementBase<
  zod.infer<typeof TypeDeclarationStatement.schema>
> {
  static readonly schema = zod.tuple([
    zod.any(),
    zod.instanceof(IdentifierExpression),
    zod.any(),
    zod.instanceof(ExpressionBase),
  ]);

  public kind = AST.SyntaxKind.S.TypeDeclaration;

  public identifier: IdentifierExpression;
  public value: ExpressionBase;

  constructor(
    pos: AST.Position,
    args: zod.infer<typeof TypeDeclarationStatement.schema>
  ) {
    super(pos);
    this.checkArgs(args, TypeDeclarationStatement.schema);
    [, this.identifier, , this.value] = args;
  }

  public compile(): string {
    return `type ${this.identifier.compile()} = ${this.value.compile()};`;
  }

  public toString(): string {
    return this.kind;
  }
}
