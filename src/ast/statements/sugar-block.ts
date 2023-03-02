import zod from "zod";
import { AST } from "../types";
import { StatementBase } from "./base";
import { IfStatement } from "./if";
import { TypeAliasStatement } from "./type-alias";

export { SugarBlockStatement };

const schema = zod.array(
  zod.instanceof(TypeAliasStatement).or(zod.instanceof(IfStatement))
);

type Schema = zod.infer<typeof schema>;

class SugarBlockStatement extends StatementBase<Schema> {
  public kind = AST.SyntaxKind.S.SugarBlock;

  public statements: Schema;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
  }

  public compile(): string {
    throw new Error(
      "[Sugar Block] Calling compile is not allowed, depending on context"
    );
  }

  public toString(): string {
    return this.kind;
  }
}
