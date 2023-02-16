import { AST } from "../types";
import { StatementBase } from "./types";
import zod from "zod";
import { ExpressionBase } from "../expressions/types";

export { TypeDeclaration };

class TypeDeclaration extends StatementBase {
  protected kind = AST.SyntaxKind.S.TypeDeclaration;
  private name: string;
  private value: ExpressionBase;

  constructor(
    pos: AST.Position,
    [, name, , value]: zod.infer<typeof TypeDeclaration.schema>
  ) {
    super(pos);
    this.name = name;
    this.value = value;
  }

  public compile(): string {
    return `type ${this.name} = ${this.value.compile()};`;
  }

  public toString(): string {
    return this.kind;
  }

  // `type name = 123` -> ["type", $id, "=", $value]
  static schema = zod.tuple([
    zod.literal("type"),
    zod.string(),
    zod.literal("="),
    zod.any(),
  ]);
}
