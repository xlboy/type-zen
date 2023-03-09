import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { GenericArgsExpression } from './generic-args';
import { IdentifierExpression } from './identifier';

export { Function };

namespace Function {
  export namespace Body {
    const schema = zod.tuple([
      zod.any() /* ( */,
      zod.array(
        zod.object({
          id: zod.instanceof(IdentifierExpression),
          type: zod.instanceof(ExpressionBase),
          rest: zod.boolean(),
          optional: zod.boolean()
        })
      ),
      zod.any() /* ) */
    ]);

    type Schema = zod.infer<typeof schema>;

    export class Expression extends ExpressionBase {
      public kind = SyntaxKind.E.FunctionBody;
      public args: Schema[1];

      constructor(pos: ASTNodePosition, args: Schema) {
        super(pos);
        this.checkArgs(args, schema);
        this.args = args[1];
      }

      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        nodeFlow.add('(');

        for (let i = 0; i < this.args.length; i++) {
          if (i !== 0) {
            nodeFlow.add(', ');
          }

          const arg = this.args[i];

          if (arg.rest) nodeFlow.add('...');

          nodeFlow.add(arg.id.compile());

          if (arg.optional) nodeFlow.add('?');

          nodeFlow.add(': ').add(arg.type.compile());
        }

        nodeFlow.add(')');

        return nodeFlow.get();
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
        .or(zod.any()); /* this 关键字 - moo.Token 类型 */
      const target = zod.instanceof(ExpressionBase);

      const main = zod
        .tuple([zod.any() /* object -> 含有 `asserts` 修饰符 */, assertSource, target])
        .or(zod.tuple([assertSource, target]))
        .or(zod.tuple([target]));

      return {
        main,
        target,
        assertSource
      };
    })();

    type Schema = zod.infer<typeof schema.main>;
    type SchemaTarget = zod.infer<typeof schema.target>;

    export class Expression extends ExpressionBase {
      public kind = SyntaxKind.E.FunctionReturn;

      public assertSource: IdentifierExpression | moo.Token;
      public target: SchemaTarget;
      public type: 'aserrt-is' | 'is' | 'normal';

      constructor(pos: ASTNodePosition, args: Schema) {
        super(pos);
        this.checkArgs(args, schema.main);
        this.initArgs(args);
      }

      private initArgs(args: Schema) {
        switch (args.length) {
          case 1:
            this.target = args[0];
            this.type = 'normal';
            break;

          case 2:
            this.assertSource = args[0];
            this.target = args[1];
            this.type = 'is';
            break;

          case 3:
            this.assertSource = args[1];
            this.target = args[2];
            this.type = 'aserrt-is';
            break;
        }
      }

      public compile() {
        switch (this.type) {
          case 'is':
          case 'aserrt-is': {
            const nodeFlow = this.compileUtils.createNodeFlow();

            if (this.type === 'aserrt-is') {
              nodeFlow.add('asserts ');
            }

            if (this.assertSource instanceof IdentifierExpression) {
              nodeFlow.add(this.assertSource.compile());
            } else {
              nodeFlow.add('this');
            }

            nodeFlow.add(' is ').add(this.target.compile());

            return nodeFlow.get();
          }

          case 'normal':
            return this.target.compile();
        }
      }

      public toString(): string {
        return this.kind;
      }
    }
  }

  export namespace Mode {
    export abstract class ArrowExpression extends ExpressionBase {
      public kind = SyntaxKind.E.FunctionArrow;

      public genericArgs?: GenericArgsExpression;
      public body: Body.Expression;
      public return: Return.Expression;

      static readonly schema = zod
        .tuple([
          zod.instanceof(GenericArgsExpression),
          zod.instanceof(Body.Expression),
          zod.instanceof(Return.Expression)
        ])
        .or(
          zod.tuple([zod.instanceof(Body.Expression), zod.instanceof(Return.Expression)])
        );

      constructor(pos: ASTNodePosition, args: zod.infer<typeof ArrowExpression.schema>) {
        super(pos);
        this.checkArgs(args, ArrowExpression.schema);
        this.initArgs(args);
      }

      private initArgs(args: zod.infer<typeof ArrowExpression.schema>) {
        if (args.length === 3) {
          [this.genericArgs, this.body, this.return] = args;
        } else {
          [this.body, this.return] = args;
        }
      }
      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        if (this.genericArgs) {
          nodeFlow.add(this.genericArgs.compile());
        }

        nodeFlow.add(this.body.compile()).add(' => ').add(this.return.compile());

        return nodeFlow.get();
      }

      public toString(): string {
        return this.kind;
      }
    }

    export class NormalExpression extends ExpressionBase {
      public kind = SyntaxKind.E.FunctionNormal;

      public genericArgs?: GenericArgsExpression;
      public body: Body.Expression;
      public return?: Return.Expression;

      static readonly schema = zod
        .tuple([
          zod.instanceof(GenericArgsExpression),
          zod.instanceof(Body.Expression),
          zod.instanceof(Return.Expression)
        ])
        .or(
          zod.tuple([zod.instanceof(Body.Expression), zod.instanceof(Return.Expression)])
        )
        .or(
          zod.tuple([
            zod.instanceof(GenericArgsExpression),
            zod.instanceof(Body.Expression)
          ])
        )
        .or(zod.tuple([zod.instanceof(Body.Expression)]));

      private tyep: 'g-b-r' | 'b-r' | 'g-b' | 'b';

      constructor(pos: ASTNodePosition, args: zod.infer<typeof NormalExpression.schema>) {
        super(pos);
        this.checkArgs(args, NormalExpression.schema);
        this.initArgs(args);
      }

      private initArgs(args: zod.infer<typeof NormalExpression.schema>) {
        if (args.length === 3) {
          [this.genericArgs, this.body, this.return] = args;
          this.tyep = 'g-b-r';
        } else if (args.length === 2) {
          if (args[0] instanceof GenericArgsExpression) {
            this.genericArgs = args[0];
            this.body = args[1] as Body.Expression;
            this.tyep = 'g-b';
          } else {
            this.body = args[0] as Body.Expression;
            this.return = args[1] as Return.Expression;
            this.tyep = 'b-r';
          }
        } else {
          this.body = args[0] as Body.Expression;
          this.tyep = 'b';
        }
      }
      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        switch (this.tyep) {
          case 'g-b-r':
            return nodeFlow
              .add(this.genericArgs!.compile())
              .add(this.body.compile())
              .add(': ')
              .add(this.return!.compile())
              .get();

          case 'b-r':
            return nodeFlow
              .add(this.body.compile())
              .add(': ')
              .add(this.return!.compile())
              .get();

          case 'g-b':
            return nodeFlow
              .add(this.genericArgs!.compile())
              .add(this.body.compile())
              .get();

          case 'b':
            return this.body.compile();
        }
      }

      public toString(): string {
        return this.kind;
      }
    }

    export class ConstructorExpression<
      Body extends NormalExpression | ArrowExpression
    > extends ExpressionBase {
      public kind = SyntaxKind.E.FunctionConstructor;

      public body: Body;

      static schema = zod.tuple([
        zod.any() /* new */,
        zod.instanceof(NormalExpression).or(zod.instanceof(ArrowExpression))
      ]);

      constructor(
        pos: ASTNodePosition,
        args: zod.infer<typeof ConstructorExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, ConstructorExpression.schema);
        this.body = args[1] as any;
      }

      public compile() {
        return this.compileUtils.createNodeFlow('new ').add(this.body.compile()).get();
      }

      public toString(): string {
        return this.kind;
      }
    }
  }
}
