import zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { Function } from './function';
import { IdentifierExpression } from './identifier';
import { NumberLiteralExpression } from './literals/number';
import { StringLiteralExpression } from './literals/string';

export { _Object as Object };

namespace _Object {
  export namespace Content {
    /** 例： `{ (name: string): void; }` */
    export const CallExpression = Function.Mode.NormalExpression;

    /** 例： `{ new (name: string): void; }` */
    export const ConstructorExpression = Function.Mode
      .ConstructorExpression<Function.Mode.NormalExpression>;

    /** 例： `{ getId(): string; getName()?: string; }` */
    export class MethodExpression extends ExpressionBase {
      public kind = SyntaxKind.E.ObjectMethod;

      static readonly schema = zod.tuple([
        zod.instanceof(IdentifierExpression),
        zod.boolean() /* optional */,
        zod.instanceof(Function.Mode.NormalExpression)
      ]);

      public name: IdentifierExpression;
      public optional: boolean;
      public body: Function.Mode.NormalExpression;

      constructor(pos: ASTNodePosition, args: zod.infer<typeof MethodExpression.schema>) {
        super(pos);
        this.checkArgs(args, MethodExpression.schema);
        [this.name, this.optional, this.body] = args;
      }

      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        nodeFlow.add(this.name.compile());

        if (this.optional) {
          nodeFlow.add('?');
        }

        nodeFlow.add(this.body.compile());

        return nodeFlow.get();
      }
      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ age: string; id?: string; }` */
    export class NormalExpression extends ExpressionBase {
      public kind = SyntaxKind.E.ObjectNormal;

      static readonly schema = zod.tuple([
        zod.instanceof(IdentifierExpression) /* name */,
        zod.boolean() /* optional */,
        zod.instanceof(ExpressionBase) /* value */
      ]);

      public name: IdentifierExpression;
      public value: ExpressionBase;
      public optional: boolean;

      constructor(pos: ASTNodePosition, args: zod.infer<typeof NormalExpression.schema>) {
        super(pos);
        this.checkArgs(args, NormalExpression.schema);
        [this.name, this.optional, this.value] = args;
      }

      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        nodeFlow.add(this.name.compile());

        if (this.optional) {
          nodeFlow.add('?');
        }

        nodeFlow.add(': ').add(this.value.compile());

        return nodeFlow.get();
      }

      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ ["age"]: string; [123]?: any; }` */
    export class LiteralIndexExpression extends ExpressionBase {
      public kind = SyntaxKind.E.ObjectLiteralIndex;

      static readonly schema = zod.tuple([
        zod.any() /* [ */,
        zod
          .instanceof(NumberLiteralExpression)
          .or(zod.instanceof(StringLiteralExpression)) /* literal name */,
        zod.boolean() /* optional */,
        zod.instanceof(ExpressionBase) /* value */
      ]);

      public literalName: NumberLiteralExpression | StringLiteralExpression;
      public value: ExpressionBase;
      public optional: boolean;

      constructor(
        pos: ASTNodePosition,
        args: zod.infer<typeof LiteralIndexExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, LiteralIndexExpression.schema);
        [, this.literalName, this.optional, this.value] = args;
      }

      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        nodeFlow.add('[').add(this.literalName.compile()).add(']');

        if (this.optional) {
          nodeFlow.add('?');
        }

        nodeFlow.add(': ').add(this.value.compile());

        return nodeFlow.get();
      }

      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ [key: string]: string }` */
    export class IndexSignatureExpression extends ExpressionBase {
      public kind = SyntaxKind.E.ObjectIndexSignature;

      static readonly schema = zod.tuple([
        zod.any() /* [ */,
        zod.instanceof(IdentifierExpression) /* name */,
        zod.instanceof(ExpressionBase) /* nameType */,
        zod.instanceof(ExpressionBase) /* value */
      ]);

      public name: IdentifierExpression;
      public nameType: ExpressionBase;
      public value: ExpressionBase;

      constructor(
        pos: ASTNodePosition,
        args: zod.infer<typeof IndexSignatureExpression.schema>
      ) {
        super(pos);
        this.checkArgs(args, IndexSignatureExpression.schema);
        [, this.name, this.nameType, this.value] = args;
      }

      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        nodeFlow
          .add('[')
          .add(this.name.compile())
          .add(': ')
          .add(this.nameType.compile())
          .add(']')
          .add(': ')
          .add(this.value.compile());

        return nodeFlow.get();
      }

      public toString(): string {
        return this.kind;
      }
    }

    /** 例： `{ [K in inSource as asTarget]: string }` */
    export class MappedExpression extends ExpressionBase {
      public kind = SyntaxKind.E.ObjectMapped;

      static readonly schema = zod.tuple([
        zod.any() /* [ */,
        zod.instanceof(IdentifierExpression) /* name(K) */,
        zod.instanceof(ExpressionBase) /* inSource */,
        zod.instanceof(ExpressionBase).or(zod.literal(false)) /* asTarget */,
        zod.tuple([zod.boolean() /* remove(-) */, zod.boolean() /* optional(?) */]),
        zod.instanceof(ExpressionBase)
      ]);

      public name: IdentifierExpression;
      public inSource: ExpressionBase;
      public asTarget: ExpressionBase | false;
      public operator: [remove: boolean, optional: boolean];
      public value: ExpressionBase;

      constructor(pos: ASTNodePosition, args: zod.infer<typeof MappedExpression.schema>) {
        super(pos);
        this.checkArgs(args, MappedExpression.schema);
        [, this.name, this.inSource, this.asTarget, this.operator, this.value] = args;
      }

      public compile() {
        const nodeFlow = this.compileUtils.createNodeFlow();

        nodeFlow
          .add('[')
          .add(this.name.compile())
          .add(' in ')
          .add(this.inSource.compile());

        if (this.asTarget) {
          nodeFlow.add(' as ').add(this.asTarget.compile());
        }

        nodeFlow.add(']');

        if (this.operator[0]) {
          nodeFlow.add('-');
        }

        if (this.operator[1]) {
          nodeFlow.add('?');
        }

        nodeFlow.add(': ').add(this.value.compile());

        return nodeFlow.get();
      }

      public toString(): string {
        return this.kind;
      }
    }
  }

  export class Expression extends ExpressionBase {
    public kind = SyntaxKind.E.Object;

    static readonly schema = zod.tuple([
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
      zod.any() /* } */
    ]);

    public contents: zod.infer<typeof Expression.schema>[1];

    constructor(pos: ASTNodePosition, args: zod.infer<typeof Expression.schema>) {
      super(pos);
      this.checkArgs(args, Expression.schema);
      [, this.contents] = args;
    }

    public compile() {
      if (this.contents.length === 0) {
        return this.compileUtils.createNodeFlow().add('{}').get();
      }

      const nodeFlow = this.compileUtils.createNodeFlow();

      nodeFlow.add('{\n');

      const { memberSeparator } = this.compileUtils.getConfig();

      for (const content of this.contents) {
        nodeFlow.add('  ').add(content.compile());

        if (memberSeparator) {
          nodeFlow.add(memberSeparator);
        }

        nodeFlow.add('\n');
      }

      nodeFlow.add('}');

      return nodeFlow.get();
    }
    public toString(): string {
      throw new Error('Method not implemented.');
    }
  }
}
