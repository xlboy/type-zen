import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { IdentifierExpression } from "./identifier";

export { ConditionExpression, InferExpression };

//#region  //*=========== condition ===========
// 例：`boolean (extends | ==) true ? b : c`
const conditionSchema = zod.tuple([
  zod.instanceof(ExpressionBase) /* boolean */,
  zod.any() /* extends | == */,
  zod.instanceof(ExpressionBase) /* true */,
  zod.any() /* ? */,
  zod.instanceof(ExpressionBase) /* b */,
  zod.any() /* : */,
  zod.instanceof(ExpressionBase) /* c */,
]);
type ConditionSchema = zod.infer<typeof conditionSchema>;

class ConditionExpression extends ExpressionBase<ConditionSchema> {
  public kind = AST.SyntaxKind.E.Condition;

  public left: ExpressionBase;
  public right: ExpressionBase;
  public then: ExpressionBase;
  public else: ExpressionBase;

  constructor(pos: AST.Position, args: ConditionSchema) {
    super(pos);
    this.checkArgs(args, conditionSchema);
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

//#endregion  //*======== condition ===========

//#region  //*=========== infer ===========
const inferSchema = zod
  .tuple([zod.any() /* "infer" */, zod.instanceof(IdentifierExpression)])
  .or(
    zod.tuple([
      zod.any() /* "infer" */,
      zod.instanceof(IdentifierExpression),
      zod.array(
        zod.instanceof(ExpressionBase)
      ) /* extends string extends name... */,
    ])
  );
type InferSchema = zod.infer<typeof inferSchema>;

class InferExpression extends ExpressionBase<InferSchema> {
  public kind = AST.SyntaxKind.E.Infer;

  public name: IdentifierExpression;
  public extendsTypes?: ExpressionBase[];

  constructor(pos: AST.Position, args: InferSchema) {
    super(pos);
    this.checkArgs(args, inferSchema);
    this.initArgs(args);
  }

  private initArgs(args: InferSchema) {
    this.name = args[1];
    if (args[2]) {
      this.extendsTypes = args[2];
    }
  }

  public compile(): string {
    const content = `infer ${this.name.compile()}`;

    if (this.extendsTypes && this.extendsTypes.length > 0) {
      return `${content} extends ${this.extendsTypes
        .map((item) => item.compile())
        .join(" extends ")}`;
    }

    return content;
  }

  public toString(): string {
    return this.kind;
  }
}

//#endregion  //*======== infer ===========
