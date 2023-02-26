import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { IdentifierExpression } from "./identifier";

export { TupleExpression };

// [1, 2, 3, "", "a", Array[number]]
const schema = zod.tuple([
  zod.any() /* [ */,
  zod.array(
    zod.object({
      id: zod.instanceof(IdentifierExpression).or(zod.literal(false)),
      type: zod.instanceof(ExpressionBase),
      optional: zod.boolean(),
      deconstruction: zod.boolean() /* ... */,
    })
  ) /* 1, 2, 3, ...items */,
  zod.any() /* ] */,
]);

type Schema = zod.infer<typeof schema>;

class TupleExpression extends ExpressionBase<Schema> {
  public kind = AST.SyntaxKind.E.Tuple;

  public values: Schema[1];

  constructor(pos: AST.Position, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [, this.values] = args;
  }

  public compile(): string {
    const content = this.values
      .map((v) => {
        let str = "";
        if (v.deconstruction) str += "...";
        if (v.id) {
          str += v.id.compile();
          if (!v.deconstruction && v.optional) str += "?";
          str += ": ";
        };
        str += v.type.compile();
        if (!v.id && v.optional && !v.deconstruction) str += "?";
        return str;
      })
      .join(", ");

    return `[${content}]`;
  }

  public toString(): string {
    return this.kind;
  }
}

type a = [a: string, b: string];
