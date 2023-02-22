import zod from "zod";
import { IdentifierExpression } from "../expressions/identifier";
import { ExpressionBase } from "../expressions/base";
import { AST } from "../types";
import { StatementBase } from "./base";
import { GenericArgsExpression } from "../expressions/generic-args";

export { TypeDeclarationStatement };

const schema = zod.tuple([
  zod.any() /* type */,
  zod.instanceof(IdentifierExpression),
  zod.instanceof(GenericArgsExpression).or(zod.undefined()),
  zod.instanceof(ExpressionBase),
]);

type Schema = zod.infer<typeof schema>;

class TypeDeclarationStatement extends StatementBase<Schema> {
  public kind = AST.SyntaxKind.S.TypeDeclaration;

  public identifier: IdentifierExpression;
  public value: ExpressionBase;
  public arguments: GenericArgsExpression | null;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.identifier, , this.value] = args;

    if (args[2]) {
      this.arguments = args[2];
    }
  }

  public compile(): string {
    return `type ${this.identifier.compile()}${
      this.arguments?.compile() || ""
    } = ${this.value.compile()};`;
  }

  public toString(): string {
    return this.kind;
  }
}
