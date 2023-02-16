import zod from "zod";
import { ExpressionBase } from "../expressions/types";
import { AST } from "../types";
import { StatementBase } from "./types";

export { TypeDeclaration };

type Schema = [
  typeKeyword: "type",
  identifier: string,
  symbol: "=",
  value: ExpressionBase<any>
];

class TypeDeclaration extends StatementBase<Schema> {
  public schema: zod.ZodSchema<Schema> = zod.tuple([
    zod.literal("type"),
    zod.string(),
    zod.literal("="),
    zod.any(),
  ]);

  public kind = AST.SyntaxKind.S.TypeDeclaration;
  private identifier: string;
  private value: ExpressionBase<any>;

  constructor(pos: AST.Position, args: Schema) {
    super(pos, args);
    [, this.identifier, , this.value] = args;
  }

  public compile(): string {
    return `type ${this.identifier} = ${this.value.compile()};`;
  }

  public toString(): string {
    return this.kind;
  }
}
