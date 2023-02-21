import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { ArrayExpression };

const schema = zod.tuple([
  zod.instanceof(ExpressionBase),
  zod.any() /* [ */,
  zod.any() /* ] */,
]);

type Schema = zod.infer<typeof schema>;

class ArrayExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.Array;

  public source: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.source] = args;
  }

  public compile(): string {
    return this.source.compile() + "[]";
  }

  public toString(): string {
    return this.kind;
  }
}
