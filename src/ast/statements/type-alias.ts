import zod from "zod";
import { ExpressionBase } from "../expressions/base";
import { GenericArgsExpression } from "../expressions/generic-args";
import { IdentifierExpression } from "../expressions/identifier";
import { AST } from "../types";
import { StatementBase } from "./base";

export { TypeAliasStatement };

const schema = zod.tuple([
  zod.any() /* type */,
  zod.instanceof(IdentifierExpression),
  zod.instanceof(GenericArgsExpression).or(zod.undefined()),
  zod.instanceof(ExpressionBase),
]);

type Schema = zod.infer<typeof schema>;

class TypeAliasStatement extends StatementBase<Schema> {
  public kind = AST.SyntaxKind.S.TypeAlias;

  public identifier: IdentifierExpression;
  public value: ExpressionBase;
  public arguments: GenericArgsExpression | undefined;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.identifier, , this.value] = args;

    this.arguments = args[2];
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
