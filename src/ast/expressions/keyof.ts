import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { KeyofExpression };

const schema = zod.tuple([
  zod.any() /* keyof*/,
  zod.instanceof(ExpressionBase) /* source */,
]);
type Schema = zod.infer<typeof schema>;

class KeyofExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.Keyof;

  public source: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.source = args[1];
  }

  public compile(): string {
    return `keyof ${this.source.compile()}`;
  }

  public toString(): string {
    return this.kind;
  }
}
