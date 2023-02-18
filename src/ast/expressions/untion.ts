import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { UnionExpression };

type Schema = Array<ExpressionBase>;
const schema: zod.Schema<Schema> = zod.array(zod.instanceof(ExpressionBase));

class UnionExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.Union;

  private values: Array<ExpressionBase>;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.values = args;
  }

  public compile(): string {
    return this.values.map((value) => value.compile()).join(" | ");
  }

  public toString(): string {
    return this.kind;
  }
}
