import zod from "zod";
import { Compiler } from "../../../api/compiler";
import { ASTBase } from "../../base";
import { ExpressionBase } from "../../expressions/base";
import { GenericArgsExpression } from "../../expressions/generic-args";
import { IdentifierExpression } from "../../expressions/identifier";
import { AST } from "../../types";
import { TopLevelStatementBase } from "./base";

export { TypeAliasStatement };

const schema = zod.tuple([
  zod.any() /* type */,
  zod.instanceof(IdentifierExpression),
  zod.instanceof(GenericArgsExpression).or(zod.undefined()),
  zod.instanceof(ASTBase) /* value */,
]);

type Schema = zod.infer<typeof schema>;

class TypeAliasStatement extends TopLevelStatementBase<Schema> {
  public kind = AST.SyntaxKind.S.TypeAlias;

  public name: IdentifierExpression;
  public value: ExpressionBase;
  public arguments?: GenericArgsExpression;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.name, this.arguments, this.value] = args;
  }

  public compile() {
    const nodes = Compiler.Utils.createNodeFlow("type")
      .add(" ")
      .add(this.name.compile());

    if (this.arguments) {
      nodes.add(this.arguments.compile());
    }

    nodes.add(" = ").add(this.value.compile());

    if (Compiler.Utils.getConfig().useLineTerminator) {
      nodes.add(";");
    }

    return [...this.compiledNodeToPrepend, nodes.get()];
  }

  public toString(): string {
    return this.kind;
  }
}
