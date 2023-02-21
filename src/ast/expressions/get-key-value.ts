import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { GetKeyValueExpression };

// CustomObject["a"][KeyVar]
const schema = zod.tuple([
  zod.instanceof(ExpressionBase) /* CustomObject */,
  zod.instanceof(ExpressionBase) /* ["a"] */,
]);
type Schema = zod.infer<typeof schema>;

class GetKeyValueExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.GetKeyValue;

  public source: Schema[0];
  public key: Schema[1];

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.source, this.key] = args;
  }

  public compile(): string {
    return `${this.source.compile()}[${this.key.compile()}]`;
  }

  public toString(): string {
    return this.kind;
  }
}
