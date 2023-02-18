import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { BracketSurroundExpression };

const schema = zod.tuple([
  zod.any(),
  zod.instanceof(ExpressionBase),
  zod.any(),
]);

type Schema = zod.infer<typeof schema>;

class BracketSurroundExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.BracketSurround;

  public value: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.value] = args;
  }

  public compile(): string {
    return `(${this.value.compile()})`;
  }

  public toString(): string {
    return this.kind;
  }
}
