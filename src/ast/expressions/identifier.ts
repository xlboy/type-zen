import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./types";

export { IdentifierExpression };

type Schema = [value: string];
class IdentifierExpression extends ExpressionBase<Schema> {
  public schema: zod.Schema<Schema> = zod.tuple([zod.string()]);
  public kind = AST.SyntaxKind.E.Identifier;

  private value: string;

  constructor(pos: AST.Position, args: Schema) {
    super(pos, args);
    [this.value] = args;
  }

  public compile(): string {
    return this.value;
  }

  public toString(): string {
    return this.kind;
  }
}
