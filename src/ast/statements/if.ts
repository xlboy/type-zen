import zod from "zod";
import { ExpressionBase } from "../expressions/base";
import { IdentifierExpression } from "../expressions/identifier";
import { AST } from "../types";
import { StatementBase } from "./base";
import { SugarBlockStatement } from "./sugar-block";

export { IfStatement };

class IfStatement extends StatementBase {
  public kind = AST.SyntaxKind.S.If;

  private static readonly schema = zod.tuple([
    zod.any() /* if */,
    zod.object({
      left: zod.instanceof(ExpressionBase),
      right: zod.instanceof(ExpressionBase),
    }),
    zod.instanceof(SugarBlockStatement) /* then */,
    zod
      .instanceof(SugarBlockStatement)
      .optional()
      .or(zod.instanceof(IfStatement).optional()) /* else */,
  ]);

  public condition: {
    left: ExpressionBase;
    right: ExpressionBase;
  };
  public then: SugarBlockStatement;
  public else: SugarBlockStatement | IfStatement | undefined;

  constructor(pos: AST.Position, args: any) {
    const _args = args as zod.infer<typeof IfStatement.schema>;
    super(pos);
    this.checkArgs(_args, IfStatement.schema);
    this.initArgs(args);
  }

  private initArgs(args: zod.infer<typeof IfStatement.schema>) {
    this.condition = args[1];
    this.then = args[2];
    this.else = args[3];
  }

  public compile(): string {
    const left = this.condition.left.compile();
    const right = this.condition.right.compile();
    
    const then = this.then.compile();
    const els = this.else?.compile() ?? "";

    return `${left} extends ${right} ? ${then} : ${els}`
  }

  public toString(): string {
    return this.kind;
  }
}
