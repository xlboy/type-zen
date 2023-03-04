import zod from "zod";
import { Compiler } from "../../../api/compiler";
import { ExpressionBase } from "../../expressions/base";
import { AST } from "../../types";
import { NormalStatementBase } from "./base";
import { SugarBlockStatement } from "./sugar-block";

export { IfStatement };

const commonSchemaTupleSource = [
  zod.any() /* if */,
  zod.object({
    left: zod.instanceof(ExpressionBase),
    right: zod.instanceof(ExpressionBase),
  }) /* condition */,
  zod.instanceof(SugarBlockStatement) /* then */,
] as const;

class IfStatement extends NormalStatementBase {
  public kind = AST.SyntaxKind.S.If;

  private static readonly schema = zod
    .tuple([
      ...commonSchemaTupleSource,
      zod
        .instanceof(SugarBlockStatement)
        .or(zod.instanceof(IfStatement))
        .or(zod.undefined()) /* else */,
    ])
    .or(zod.tuple([...commonSchemaTupleSource]));

  public condition: {
    left: ExpressionBase;
    right: ExpressionBase;
  };
  public then: SugarBlockStatement;
  public else?: SugarBlockStatement | IfStatement;

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

  public compile() {
    const nodeFlow = Compiler.Utils.createNodeFlow(
      this.condition.left.compile()
    )
      .add(" extends ")
      .add(this.condition.right.compile())
      .add(" ? ")
      .add(this.then.compile())
      .add(" : ");

    if (this.else) {
      nodeFlow.add(this.else.compile());
    } else {
      nodeFlow.add(Compiler.Constants.UnreturnedSymbol);
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}
