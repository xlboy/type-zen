import zod from "zod";
import { Function } from "../../expressions/function";
import { IdentifierExpression } from "../../expressions/identifier";
import { AST } from "../../types";
import { TopLevelStatementBase } from "./base";

export { DeclareFunctionStatement };

const commonSchemaTupleSource = [
  zod.any() /* declare */,
  zod.instanceof(IdentifierExpression) /* identifier */,
] as const;

const schema = zod
  .tuple([
    ...commonSchemaTupleSource,
    zod.instanceof(Function.Mode.NormalExpression) /* value */,
  ])
  .or(zod.tuple([...commonSchemaTupleSource]));

type Schema = zod.infer<typeof schema>;

class DeclareFunctionStatement extends TopLevelStatementBase<Schema> {
  public kind = AST.SyntaxKind.S.DeclareFunction;

  public name: IdentifierExpression;
  public body?: Function.Mode.NormalExpression;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    this.name = args[1];
    this.body = args[2];
  }

  public compile()  {
    // let str = `declare function ${this.name.compile()}`;
    //
    // if (this.body) {
    //   str += this.body.compile();
    // }
    //
    // return str + ";";
  }

  public toString(): string {
    return this.kind;
  }
}