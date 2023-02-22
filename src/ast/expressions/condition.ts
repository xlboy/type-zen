import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";

export { ConditionExpression };

// 例：`boolean (extends | ==) true ? b : c`
const schema = zod.tuple([
  zod.instanceof(ExpressionBase) /* boolean */,
  zod.any() /* extends | == */,
  zod.instanceof(ExpressionBase) /* true */,
  zod.any() /* ? */,
  zod.instanceof(ExpressionBase) /* b */,
  zod.any() /* : */,
  zod.instanceof(ExpressionBase) /* c */,
]);
type Schema = zod.infer<typeof schema>;

class ConditionExpression extends ExpressionBase {
  public kind = AST.SyntaxKind.E.Condition;

  public left: ExpressionBase;
  public right: ExpressionBase;
  public then: ExpressionBase;
  public else: ExpressionBase;

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.left, , this.right, , this.then, , this.else] = args;
  }

  public compile(): string {
    return [
      this.left.compile(),
      "extends",
      this.right.compile(),
      "?",
      this.then.compile(),
      ":",
      this.else.compile(),
    ].join(" ");
  }

  public toString(): string {
    return this.kind;
  }
}
