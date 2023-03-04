import zod from "zod";
import { Compiler } from "../../../api/compiler";
import { ASTBase } from "../../base";
import { ExpressionBase } from "../../expressions/base";
import { AST } from "../../types";
import { NormalStatementBase } from "./base";

export { ReturnStatement };

const schema = zod.tuple([
  zod.any() /* return */,
  zod.instanceof(ASTBase),
  // TODO： 为 undefined 时，自动返回其他值？
  // .or(zod.undefined()),
]);

type Schema = zod.infer<typeof schema>;
class ReturnStatement extends NormalStatementBase {
  public kind = AST.SyntaxKind.S.Return;

  public body: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.body] = args;
  }

  public compile() {
    return this.body.compile();
  }

  public toString(): string {
    return this.kind;
  }
}
