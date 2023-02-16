import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./types";

export { UnionExpression };

type Schema = Array<ExpressionBase<any>>;
class UnionExpression extends ExpressionBase<Schema> {
  public schema: zod.Schema<Schema> = zod.array(zod.any());
  public kind = AST.SyntaxKind.E.Union;

  private values: Array<ExpressionBase<any>>;

  constructor(pos: AST.Position, args: Schema) {
    super(pos, args);
    this.values = args;
  }

  public compile(): string {
    return this.values.map((value) => value.compile()).join(" | ");
  }

  public toString(): string {
    return this.kind;
  }
}
