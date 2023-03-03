import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { IdentifierExpression } from "./identifier";

export { TypeReferenceExpression };

const schema = zod
  .tuple([zod.instanceof(IdentifierExpression)])
  .or(
    zod.tuple([
      zod.instanceof(IdentifierExpression),
      zod.any() /* < */,
      zod.array(zod.instanceof(ExpressionBase)),
      zod.any() /* > */,
    ])
  );

type Schema = zod.infer<typeof schema>;

class TypeReferenceExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.TypeReference;

  public name: IdentifierExpression;
  public arguments: Array<ExpressionBase> = [];

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.name] = args;
    if (args.length > 1) {
      if (args[2]) this.arguments = args[2];
    }
  }

  public compile(): string {
    if (this.arguments.length === 0) {
      return this.name.compile();
    }

    return [
      this.name.compile(),
      "<",
      this.arguments.map((arg) => arg.compile()).join(", "),
      ">",
    ].join("");
  }

  public toString(): string {
    return this.kind;
  }
}
