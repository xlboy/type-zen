import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { IntersectionExpression };

const schema = zod
  .tuple([zod.array(zod.instanceof(ExpressionBase))])
  .or(
    zod.tuple([
      zod.any() /* | */,
      zod.array(zod.instanceof(ExpressionBase)),
      zod.any() /* ] */,
    ])
  );
type Schema = zod.infer<typeof schema>;

class IntersectionExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.Intersection

  public isExtended: boolean;
  public values: Array<ExpressionBase>;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    this.initArgs(args);
  }

  private initArgs(args: Schema) {
    if (args.length === 1) {
      this.isExtended = false;
      this.values = args[0];
    } else {
      this.isExtended = true;
      this.values = args[1];
    }
  }

  public compile(): string {
    return this.values.map((value) => value.compile()).join(" & ");
  }

  public toString(): string {
    return this.kind;
  }
}
