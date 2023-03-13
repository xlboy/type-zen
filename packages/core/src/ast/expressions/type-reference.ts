import * as zod from 'zod';

import type { CompiledNode } from '../../compiler';
import type { ASTNodePosition, SugarBlockExpression, TypeAliasStatement } from '..';
import { SyntaxKind } from '../constants';
import { ExpressionBase } from './base';
import { IdentifierExpression } from './identifier';

export { TypeReferenceExpression };

const schema = zod
  .tuple([zod.instanceof(IdentifierExpression)])
  .or(
    zod.tuple([
      zod.instanceof(IdentifierExpression),
      zod.any() /* < */,
      zod.array(zod.instanceof(ExpressionBase)),
      zod.any() /* > */
    ])
  );

type Schema = zod.infer<typeof schema>;

class TypeReferenceExpression extends ExpressionBase {
  public kind = SyntaxKind.E.TypeReference;

  public name: IdentifierExpression;
  public arguments: Array<ExpressionBase> = [];

  constructor(pos: ASTNodePosition, args: Schema) {
    super(pos);
    this.checkArgs(args, schema);
    [this.name] = args;
    if (args.length > 1) {
      if (args[2]) this.arguments = args[2];
    }
  }

  public compile() {
    const nodeFlow = this.compileUtils.createNodeFlow();

    nodeFlow.add(this.getActualOutput());

    if (this.arguments.length === 0) {
      return nodeFlow.get();
    }

    nodeFlow.add('<');

    for (let i = 0; i < this.arguments.length; i++) {
      if (i !== 0) {
        nodeFlow.add(', ');
      }

      nodeFlow.add(this.arguments[i].compile());
    }

    nodeFlow.add('>');

    return nodeFlow.get();
  }

  public toString(): string {
    return this.kind;
  }

  // “真实名称”在各场景下有不同的模样
  // 它的来源如果是 “同级糖块作用域” 中正在处理的 “兄弟-局部变量”，那它的具体输出应该为 “‘兄弟-局部变量’对应的值” （因为编译后的 TS规则 原因）
  // 它的来源如果是 “上游糖块作用域” 中的 “‘可接收泛型参数’的局部变量”，那它的真实名称是被混淆过的（根据上游糖块节点中的toHoistIdentifierMap拿到）
  private getActualOutput(): CompiledNode[] {
    const compileChain = this.compileUtils.getChain();

    const nearestSugarBlockExpr = this.compileUtils.getNearestSugarBlockExpr();

    // 连最基本的“糖块”都没有的话，证明这个类型引用是在最顶级的全局作用域下的，它的具体输出是其本身
    if (!nearestSugarBlockExpr) return this.name.compile();

    // 先在 “同级糖块作用域 - 处理中的 [兄弟-局部变量] 们” 中找找是否有相匹的 “兄弟-局部变量” 名称
    for (const processingSiblingLocalVarStmt of nearestSugarBlockExpr.processingLocalVars) {
      if (
        !processingSiblingLocalVarStmt.arguments &&
        processingSiblingLocalVarStmt.name.value === this.name.value
      ) {
        return processingSiblingLocalVarStmt.value.compile();
      }
    }

    // 没有找到相匹的 “兄弟-局部变量”名称，则去 “上游糖块作用域” 中找找是否有相匹的 “‘可接收泛型参数’的局部变量” 名称
    for (let i = compileChain.length - 1; i >= 0; i--) {
      const currentNode = compileChain[i];

      if (currentNode.kind === SyntaxKind.E.SugarBlock) {
        const outputName = (currentNode as SugarBlockExpression).toHoistIdentifierMap.get(
          this.name.value
        );

        if (outputName) {
          return [{ text: outputName, pos: {} }];
        }
      }
    }

    return this.name.compile();
  }
}
