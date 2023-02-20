import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { IdentifierExpression } from "./identifier";

export { TypeDeclarationArgsExpression };

const schema = zod.tuple([
  zod.any() /* < */,
  zod.array(
    zod.object({
      id: zod.instanceof(IdentifierExpression),
      type: zod.instanceof(ExpressionBase).or(zod.undefined()).or(zod.null()),
      default: zod
        .instanceof(ExpressionBase)
        .or(zod.undefined())
        .or(zod.null()),
    })
  ),
  zod.any() /* > */,
]);

type Schema = zod.infer<typeof schema>;

class TypeDeclarationArgsExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.TypeDeclarationArgs;

  public values: Schema[1];

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.values] = args;
  }

  public compile(): string {
    return [
      "<",
      this.values
        .map((v) => {
          let str = v.id.compile();
          if (v.type) str += ` extends ${v.type.compile()}`;
          if (v.default) str += ` = ${v.default.compile()}`;
          return str;
        })
        .join(", "),
      ">",
    ].join("");
  }

  public toString(): string {
    return this.kind;
  }
}
