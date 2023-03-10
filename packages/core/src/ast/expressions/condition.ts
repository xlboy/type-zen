import * as zod from 'zod';

import type { ASTNodePosition } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

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
  zod.instanceof(ExpressionBase) /* c */
]);

type ConditionSchema = zod.infer<typeof conditionSchema>;

class ConditionExpression extends ExpressionBase {
  public kind = SyntaxKind.E.Condition;

  public left: ExpressionBase;
  public right: ExpressionBase;
  public then: ExpressionBase;
  public else: ExpressionBase;

  constructor(pos: ASTNodePosition, args: ConditionSchema) {
    super(pos);
    this.checkArgs(args, conditionSchema);
    [this.left, , this.right, , this.then, , this.else] = args;
  }

  public compile() {
    return this.compileUtils
      .createNodeFlow(this.left.compile())
      .add(' extends ')
      .add(this.right.compile())
      .add(' ? ')
      .add(this.then.compile())
      .add(' : ')
      .add(this.else.compile())
      .get();
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
        zod.instanceof(ExpressionBase) /* string, name, ... */
      ) /* extends string extends name... */
    ])
  );

type InferSchema = zod.infer<typeof inferSchema>;

class InferExpression extends ExpressionBase {
  public kind = SyntaxKind.E.Infer;

  public name: IdentifierExpression;
  public extendsTypes?: ExpressionBase[];

  constructor(pos: ASTNodePosition, args: InferSchema) {
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

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow('infer ').add(this.name.compile());

    if (this.extendsTypes && this.extendsTypes.length > 0) {
      nodeFlow.add(' extends ');

      for (let i = 0; i < this.extendsTypes.length; i++) {
        const item = this.extendsTypes[i];

        if (i !== 0) {
          nodeFlow.add(' extends ');
        }

        nodeFlow.add(item.compile());
      }
    }

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }
}

//#endregion  //*======== infer ===========
