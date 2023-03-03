import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { GetKeyValueExpression };

// CustomObject["a"]
const schema = zod.tuple([
  zod.instanceof(ExpressionBase) /* CustomObject */,
  zod.any() /* [ */,
  zod.instanceof(ExpressionBase) /* "a" */,
  zod.any() /* ] */,
]);
type Schema = zod.infer<typeof schema>;

class GetKeyValueExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.GetKeyValue;

  public source: ExpressionBase;
  public key: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.source, ,this.key] = args;
  }

  public compile(): string {
    return `${this.source.compile()}[${this.key.compile()}]`;
  }

  public toString(): string {
    return this.kind;
  }
}
