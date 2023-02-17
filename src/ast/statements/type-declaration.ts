import zod from "zod";
import { IdentifierExpression } from "../expressions/identifier";
import { ExpressionBase } from "../expressions/types";
import { AST } from "../types";
import { StatementBase } from "./types";

export { TypeDeclaration };

class TypeDeclaration extends StatementBase<
  zod.infer<typeof TypeDeclaration.schema>
> {
  static readonly schema = zod.tuple([
    zod.any(),
    zod.instanceof(IdentifierExpression),
    zod.any(),
    zod.instanceof(ExpressionBase),
  ]);

  public kind = AST.SyntaxKind.S.TypeDeclaration;
  private identifier: IdentifierExpression;
  private value: ExpressionBase;

  constructor(
    pos: AST.Position,
    args: zod.infer<typeof TypeDeclaration.schema>
  ) {
    super(pos);
    this.checkArgs(args, TypeDeclaration.schema);
    [, this.identifier, , this.value] = args;
  }

  public compile(): string {
    return `type ${this.identifier.compile()} = ${this.value.compile()};`;
  }

  public toString(): string {
    return this.kind;
  }
}
