import zod from "zod";
import { ExpressionBase } from "../../expressions/base";
import { IdentifierExpression } from "../../expressions/identifier";
import { AST } from "../../types";
import { TopLevelStatementBase } from "./base";

export { DeclareVariableStatement };

const commonSchemaTupleSource = [
  zod.any() /* declare */,
  zod.literal("var").or(zod.literal("let")).or(zod.literal("const")),
  zod.instanceof(IdentifierExpression) /* identifier */,
] as const;

const schema = zod
  .tuple([
    ...commonSchemaTupleSource,
    zod.instanceof(ExpressionBase) /* value */,
  ])
  .or(zod.tuple([...commonSchemaTupleSource]));

type Schema = zod.infer<typeof schema>;

class DeclareVariableStatement extends TopLevelStatementBase<Schema> {
  public kind = AST.SyntaxKind.S.DeclareVariable;

  public declareType: Schema[1];
  public name: IdentifierExpression;
  public value?: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    this.declareType = args[1];
    this.name = args[2];
    this.value = args[3];
  }

  public compile(): string {
    let str = `declare ${this.declareType} ${this.name.compile()}`;

    if (this.value) {
      str += `: ${this.value.compile()}`;
    }

    return str + ";";
  }

  public toString(): string {
    return this.kind;
  }
}
