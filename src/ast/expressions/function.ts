import zod from "zod";
import { AST } from "../types";
import { ExpressionBase } from "./base";
import { IdentifierExpression } from "./identifier";
import { ValueKeywordExpression } from "./value-keyword";
import { GenericArgsExpression } from "./generic-args";

export { Function };

namespace Function {
  export namespace Body {
    const schema = zod.tuple([
      zod.any(), /* ( */
      zod.array(
        zod.object({
          id: zod.instanceof(IdentifierExpression),
          type: zod.instanceof(ExpressionBase),
        })
      ),
      zod.any(), /* ) */
    ]);

    type Schema = zod.infer<typeof schema>;

    export class Expression extends ExpressionBase {
      public kind = AST.SyntaxKind.E.FunctionBodyExpression;
      public args: Schema[1];

      constructor(pos: AST.Position, args: Schema) {
        super(pos);
        this.checkArgs(args, schema);
        this.args = args[1];
      }

      public compile(): string {
        return [
          "(",
          this.args
            .map((arg) => `${arg.id.compile()}: ${arg.type.compile()}`)
            .join(", "),
          ")",
        ].join("");
      }

      public toString(): string {
        return this.kind;
      }
    }
  }

  export namespace Return {
    const schema = (() => {
      const assertSource = zod
        .instanceof(IdentifierExpression) /* 纯 id */
        .or(zod.instanceof(ValueKeywordExpression)); /* this 关键字 */
      const target = zod.instanceof(ExpressionBase);

      const main = zod
        .tuple([
          zod.any() /* object -> 含有 `asserts` 修饰符 */,
          assertSource,
          target,
        ])
        .or(zod.tuple([assertSource, target]))
        .or(zod.tuple([target]));

      return {
        main,
        target,
        assertSource,
      };
    })();
    type Schema = zod.infer<typeof schema.main>;
    type SchemaTarget = zod.infer<typeof schema.target>;
    type SchemaAssertSource = zod.infer<typeof schema.assertSource>;

    export class Expression extends ExpressionBase {
      public kind = AST.SyntaxKind.E.FunctionReturnExpression;

      public hasAsserts: boolean;
      public assertSource: SchemaAssertSource;
      public target: SchemaTarget;
      public type: "aserrt-is" | "is" | "normal";

      constructor(pos: AST.Position, args: Schema) {
        super(pos);
        this.checkArgs(args, schema.main);
        this.initArgs(args);
      }

      private initArgs(args: Schema) {
        switch (args.length) {
          case 1:
            this.target = args[0];
            this.type = "normal";
            break;

          case 2:
            this.assertSource = args[0];
            this.target = args[1];
            this.type = "is";
            break;

          case 3:
            this.hasAsserts = true;
            this.assertSource = args[1];
            this.target = args[2];
            this.type = "aserrt-is";
            break;
        }
      }

      public compile(): string {
        switch (this.type) {
          case "aserrt-is":
            return `asserts ${this.assertSource.compile()} is ${this.target.compile()}`;

          case "is":
            return `${this.assertSource.compile()} is ${this.target.compile()}`;

          case "normal":
            return this.target.compile();
        }
      }

      public toString(): string {
        return this.kind;
      }
    }
  }

  export namespace Mode {
    export namespace Arrow {
      const schema = zod
        .tuple([
          zod.instanceof(GenericArgsExpression),
          zod.instanceof(Body.Expression),
          zod.instanceof(Return.Expression),
        ])
        .or(
          zod.tuple([
            zod.instanceof(Body.Expression),
            zod.instanceof(Return.Expression),
          ])
        );

      type Schema = zod.infer<typeof schema>;

      export class Expression extends ExpressionBase {
        public kind = AST.SyntaxKind.E.ArrowFunctionExpression;

        public genericArgs: GenericArgsExpression | null;
        public body: Body.Expression;
        public return: Return.Expression;

        constructor(pos: AST.Position, args: Schema) {
          super(pos);
          this.checkArgs(args, schema);
          this.initArgs(args);
        }

        private initArgs(args: Schema) {
          if (args.length === 3) {
            [this.genericArgs, this.body, this.return] = args;
          } else {
            this.genericArgs = null;
            [this.body, this.return] = args;
          }
        }
        public compile(): string {
          const mainContent = `${this.body.compile()} => ${this.return.compile()}`;

          if (this.genericArgs) {
            return `${this.genericArgs.compile()}${mainContent}`;
          }

          return mainContent;
        }

        public toString(): string {
          return this.kind;
        }
      }
    }
  }
}
