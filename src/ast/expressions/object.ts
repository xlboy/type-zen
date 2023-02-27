import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { Function } from "./function";
import { IdentifierExpression } from "./identifier";
import { NumberLiteralExpression } from "./literals/number";
import { StringLiteralExpression } from "./literals/string";

export { _Object as Object };

namespace _Object {
  export namespace Content {
    /** 例： `{ (name: string): void; }` */
    export const CallExpression = Function.Mode.RegularExpression;
    // export class CallExpression extends Function.Mode.RegularExpression {}

    /** 例： `{ new (name: string): void; }` */
    export const ConstructorExpression = Function.Mode
      .ConstructorExpression<Function.Mode.RegularExpression>;

    /** 例： `{ getId(): string; getName()?: string; }` */
    export class MethodExpression extends ExpressionBase {
      public kind: AST.SyntaxKind.E = AST.SyntaxKind.E.Object_Method;

      private static readonly schema = zod.tuple([
        zod.instanceof(IdentifierExpression),
        zod.boolean() /* optional */,
        zod.instanceof(Function.Mode.RegularExpression),
      ]);

      public name: IdentifierExpression;
      public optional: boolean;
      public regularFn: Function.Mode.RegularExpression;

      constructor(
        pos: AST.Position,
        args: zod.infer<typeof MethodExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, MethodExpression.schema);
        [this.name, this.optional, this.regularFn] = args;
      }

      public compile(): string {
        return [
          this.name.compile(),
          this.optional ? "?" : "",
          this.regularFn.compile(),
        ].join("");
      }
      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ age: string; id?: string; }` */
    export class NormalExpression extends ExpressionBase {
      public kind = AST.SyntaxKind.E.Object_Normal;

      private static readonly schema = zod.tuple([
        zod.instanceof(IdentifierExpression) /* name */,
        zod.boolean() /* optional */,
        zod.instanceof(ExpressionBase) /* value */,
      ]);

      public name: IdentifierExpression;
      public value: ExpressionBase;
      public optional: boolean;

      constructor(
        pos: AST.Position,
        args: zod.infer<typeof NormalExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, NormalExpression.schema);
        [this.name, this.optional, this.value] = args;
      }

      public compile(): string {
        return [
          this.name.compile(),
          this.optional ? "?" : "",
          ": ",
          this.value.compile(),
        ].join("");
      }

      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ ["age"]: string; [123]?: any; }` */
    export class LiteralIndexExpression extends ExpressionBase {
      public kind = AST.SyntaxKind.E.Object_LiteralIndex;

      private static readonly schema = zod.tuple([
        zod.any() /* [ */,
        zod
          .instanceof(NumberLiteralExpression)
          .or(zod.instanceof(StringLiteralExpression)) /* literal name */,
        zod.boolean() /* optional */,
        zod.instanceof(ExpressionBase) /* value */,
      ]);

      public literalName: NumberLiteralExpression | StringLiteralExpression;
      public value: ExpressionBase;
      public optional: boolean;

      constructor(
        pos: AST.Position,
        args: zod.infer<typeof LiteralIndexExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, LiteralIndexExpression.schema);
        [, this.literalName, this.optional, this.value] = args;
      }

      public compile(): string {
        return [
          `[${this.literalName.compile()}]`,
          this.optional ? "?" : "",
          ": ",
          this.value.compile(),
          ";",
        ].join("");
      }

      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ [key: string]: string }` */
    export class IndexSignatureExpression extends ExpressionBase {
      public kind = AST.SyntaxKind.E.Object_IndexSignature;

      private static readonly schema = zod.tuple([
        zod.any() /* [ */,
        zod.instanceof(IdentifierExpression) /* name */,
        zod.instanceof(ExpressionBase) /* type */,
        zod.instanceof(ExpressionBase) /* value */,
        zod.any() /* ] */,
      ]);

      public name: IdentifierExpression;
      public type: ExpressionBase;
      public value: ExpressionBase;

      constructor(
        pos: AST.Position,
        args: zod.infer<typeof IndexSignatureExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, IndexSignatureExpression.schema);
        [this.name] = args;
      }

      public compile(): string {
        return `[${this.name.compile()}: ${this.type.compile()}]: ${this.value.compile()};`;
      }

      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ [K in inSource as asTarget]: string }` */
    export class MappedExpression extends ExpressionBase {
      public kind = AST.SyntaxKind.E.Object_Mapped;

      private static readonly schema = zod.tuple([
        zod.any() /* [ */,
        zod.instanceof(IdentifierExpression) /* name(K) */,
        zod.instanceof(ExpressionBase) /* inSource */,
        zod.instanceof(ExpressionBase).or(zod.literal(false)) /* asTarget */,
        zod.tuple([
          zod.boolean() /* remove(-) */,
          zod.boolean() /* optional(?) */,
        ]),
        zod.instanceof(ExpressionBase) /* value(string) */,
      ]);

      public name: IdentifierExpression;
      public inSource: ExpressionBase;
      public asTarget: ExpressionBase | false;
      public operator: [remove: boolean, optional: boolean];
      public value: ExpressionBase;

      constructor(
        pos: AST.Position,
        args: zod.infer<typeof MappedExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, MappedExpression.schema);
        [, this.name, this.inSource, this.asTarget, this.operator, this.value] =
          args;
      }

      public compile(): string {
        let leftKey = `[${this.name.compile()} in ${this.inSource.compile()}`;

        if (this.asTarget) {
          leftKey += ` as ${this.asTarget.compile()}`;
        }
        leftKey += "]";

        return [
          leftKey,
          this.operator[0] ? "-" : "",
          this.operator[1] ? "?" : "",
          ": ",
          this.value.compile(),
          ";",
        ].join("");
      }

      public toString(): string {
        return this.kind;
      }
    }
  }

  export class Expression extends ExpressionBase {
    public kind: AST.SyntaxKind.E = AST.SyntaxKind.E.Object;

    private static readonly schema = zod.tuple([
      zod.any() /* { */,
      zod.array(
        zod
          .instanceof(Content.CallExpression)
          .or(zod.instanceof(Content.ConstructorExpression))
          .or(zod.instanceof(Content.MethodExpression))
          .or(zod.instanceof(Content.NormalExpression))
          .or(zod.instanceof(Content.LiteralIndexExpression))
          .or(zod.instanceof(Content.IndexSignatureExpression))
          .or(zod.instanceof(Content.MappedExpression))
      ),
      zod.any() /* } */,
    ]);

    public contents: zod.infer<typeof Expression.schema>[1];

    constructor(pos: AST.Position, args: zod.infer<typeof Expression.schema>) {
      super(pos);
      this.checkArgs(args, Expression.schema);
      [, this.contents] = args;
    }

    public compile(): string {
      return [
        "{\n",
        this.contents
          .map((item) =>  `  ${item.compile()}`)
          .join("\n"),
        "\n}",
      ].join("");
    }
    public toString(): string {
      throw new Error("Method not implemented.");
    }
  }
}
