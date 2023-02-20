import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { IdentifierExpression } from "./identifier";

export { TypeReferenceExpression };

type Schema1 = [
  identifier: IdentifierExpression,
  symbol1: "<" & any,
  arguments: Array<ExpressionBase>,
  symbol2: ">" & any
];

type Schema2 = [identifier: IdentifierExpression];

const schema = zod
  .tuple([zod.instanceof(IdentifierExpression)])
  .or(
    zod.tuple([
      zod.instanceof(IdentifierExpression),
      zod.any(),
      zod.array(zod.instanceof(ExpressionBase)),
      zod.any(),
    ])
  );

class TypeReferenceExpression extends ExpressionBase<Schema1 | Schema2> {
  public kind = AST.SyntaxKind.E.TypeReference;

  public identifier: IdentifierExpression;
  public arguments?: Array<ExpressionBase>;

  constructor(pos: AST.Position, args: Schema1 | Schema2) {
    super(pos);
    this.checkArgs(args, schema);
    [this.identifier] = args;
    if (args.length > 1) {
      [, , this.arguments] = args;
    }
  }

  public compile(): string {
    if (!this.arguments || this.arguments.length === 0) {
      return this.identifier.compile();
    }

    return [
      this.identifier.compile(),
      "<",
      this.arguments.map((arg) => arg.compile()).join(", "),
      ">",
    ].join("");
  }

  public toString(): string {
    return this.kind;
  }
}
