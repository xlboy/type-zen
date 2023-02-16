import { AST } from "../types";
import { ExpressionBase } from "./types";
import zod from "zod";

export { ValueKeywordExpression };

type Schema = [value: string];
class ValueKeywordExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.ValueKeyword;
  public schema: zod.Schema<Schema> = zod.tuple([zod.string()]);
  private value: string;

  constructor(pos: AST.Position, args: Schema) {
    super(pos, args);
    [this.value] = args;
  }

  public compile(): string {
    return this.value;
  }

  public toString(): string {
    return `${this.value}Keyword`;
  }

  // static schema
}
